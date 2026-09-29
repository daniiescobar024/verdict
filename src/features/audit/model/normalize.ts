import type { PsiAudit, PsiCategory, PsiLoadingExperience, PsiResponse } from './psi-types.js';
import type {
  AuditReport,
  CategoryKey,
  FieldData,
  FieldMetric,
  FieldMetricId,
  Finding,
  LabMetric,
  LabMetricId,
  Rating,
  Strategy,
} from './types.js';
import { rateMetric } from './thresholds.js';

const CATEGORY_MAP = [
  ['performance', 'performance'],
  ['accessibility', 'accessibility'],
  ['best-practices', 'bestPractices'],
  ['seo', 'seo'],
] as const satisfies readonly (readonly [string, CategoryKey])[];

const LAB_AUDITS: readonly (readonly [LabMetricId, string])[] = [
  ['fcp', 'first-contentful-paint'],
  ['lcp', 'largest-contentful-paint'],
  ['tbt', 'total-blocking-time'],
  ['cls', 'cumulative-layout-shift'],
  ['si', 'speed-index'],
];

const FIELD_KEYS: readonly (readonly [FieldMetricId, string])[] = [
  ['lcp', 'LARGEST_CONTENTFUL_PAINT_MS'],
  ['inp', 'INTERACTION_TO_NEXT_PAINT'],
  ['cls', 'CUMULATIVE_LAYOUT_SHIFT_SCORE'],
  ['fcp', 'FIRST_CONTENTFUL_PAINT_MS'],
  ['ttfb', 'EXPERIMENTAL_TIME_TO_FIRST_BYTE'],
];

const SCORED_MODES = new Set(['numeric', 'binary', 'metricSavings']);
const IGNORED_GROUPS = new Set(['metrics', 'hidden']);
const MAX_FINDINGS = 24;

const toPercent = (score: number | null | undefined): number | null =>
  typeof score === 'number' ? Math.round(score * 100) : null;

const FIELD_RATING: Record<string, Rating> = {
  FAST: 'good',
  AVERAGE: 'needs-improvement',
  SLOW: 'poor',
};

function normalizeField(experience: PsiLoadingExperience | undefined): FieldMetric[] {
  const metrics = experience?.metrics;
  if (!metrics) return [];
  return FIELD_KEYS.flatMap(([id, key]): FieldMetric[] => {
    const raw = metrics[key]?.percentile;
    if (typeof raw !== 'number') return [];
    // CrUX reports CLS multiplied by 100.
    const p75 = id === 'cls' ? raw / 100 : raw;
    return [{ id, p75, rating: rateMetric(id, p75) }];
  });
}

function pickField(response: PsiResponse): FieldData | null {
  const page = normalizeField(response.loadingExperience);
  const usePage = page.length > 0;
  const source = usePage ? response.loadingExperience : response.originLoadingExperience;
  const metrics = usePage ? page : normalizeField(response.originLoadingExperience);
  if (metrics.length === 0) return null;
  return {
    isOriginFallback: !usePage,
    overall: FIELD_RATING[source?.overall_category ?? ''] ?? null,
    metrics,
  };
}

function estimateSavings(audit: PsiAudit): number | null {
  const direct = audit.details?.overallSavingsMs;
  if (typeof direct === 'number' && direct > 0) return Math.round(direct);
  const fromMetrics = audit.metricSavings?.LCP ?? audit.metricSavings?.FCP;
  return typeof fromMetrics === 'number' && fromMetrics > 0 ? Math.round(fromMetrics) : null;
}

function collectFindings(
  categories: [CategoryKey, PsiCategory][],
  audits: Record<string, PsiAudit | undefined>,
): Finding[] {
  const seen = new Set<string>();
  const findings: (Finding & { weight: number })[] = [];

  for (const [category, data] of categories) {
    for (const ref of data.auditRefs ?? []) {
      if (seen.has(ref.id) || (ref.group && IGNORED_GROUPS.has(ref.group))) continue;
      const audit = audits[ref.id];
      if (!audit || typeof audit.score !== 'number' || audit.score >= 0.9) continue;
      if (!SCORED_MODES.has(audit.scoreDisplayMode ?? '')) continue;

      seen.add(ref.id);
      findings.push({
        id: ref.id,
        category,
        title: audit.title ?? ref.id,
        description: audit.description ?? '',
        severity: audit.score < 0.5 ? 'critical' : 'warning',
        savingsMs: category === 'performance' ? estimateSavings(audit) : null,
        weight: ref.weight ?? 0,
      });
    }
  }

  return findings
    .sort(
      (a, b) =>
        Number(b.severity === 'critical') - Number(a.severity === 'critical') ||
        (b.savingsMs ?? 0) - (a.savingsMs ?? 0) ||
        b.weight - a.weight,
    )
    .slice(0, MAX_FINDINGS)
    .map(({ weight, ...finding }) => finding);
}

export class NormalizeError extends Error {
  override name = 'NormalizeError';
}

export function normalizeReport(
  response: PsiResponse,
  requestedUrl: string,
  strategy: Strategy,
): AuditReport {
  const lighthouse = response.lighthouseResult;
  if (!lighthouse?.categories || !lighthouse.audits) {
    throw new NormalizeError('PageSpeed returned no Lighthouse result');
  }
  const audits = lighthouse.audits;

  const categories = CATEGORY_MAP.flatMap(([psiKey, key]): [CategoryKey, PsiCategory][] => {
    const category = lighthouse.categories?.[psiKey];
    return category ? [[key, category]] : [];
  });

  const scores: Record<CategoryKey, number | null> = {
    performance: null,
    accessibility: null,
    bestPractices: null,
    seo: null,
  };
  for (const [key, category] of categories) scores[key] = toPercent(category.score);

  const lab = LAB_AUDITS.flatMap(([id, auditId]): LabMetric[] => {
    const audit = audits[auditId];
    if (typeof audit?.numericValue !== 'number') return [];
    return [
      {
        id,
        value: audit.numericValue,
        display: audit.displayValue ?? '',
        rating: rateMetric(id, audit.numericValue),
      },
    ];
  });

  const shot = audits['final-screenshot']?.details?.data;

  return {
    requestedUrl,
    finalUrl: lighthouse.finalDisplayedUrl ?? lighthouse.finalUrl ?? requestedUrl,
    strategy,
    fetchedAt: lighthouse.fetchTime ?? response.analysisUTCTimestamp ?? new Date().toISOString(),
    lighthouseVersion: lighthouse.lighthouseVersion ?? null,
    scores,
    lab,
    field: pickField(response),
    findings: collectFindings(categories, audits),
    screenshot: typeof shot === 'string' && shot.startsWith('data:image/') ? shot : null,
  };
}

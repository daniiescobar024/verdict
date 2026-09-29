/**
 * The subset of the PageSpeed Insights v5 response this app reads.
 * Everything is optional on purpose: Lighthouse evolves between versions and
 * the normalizer must degrade gracefully instead of crashing on a missing field.
 * Reference: https://developers.google.com/speed/docs/insights/rest/v5/pagespeedapi/runpagespeed
 */

export interface PsiAuditRef {
  id: string;
  weight?: number;
  group?: string;
}

export interface PsiCategory {
  id?: string;
  title?: string;
  score?: number | null;
  auditRefs?: PsiAuditRef[];
}

export type PsiScoreDisplayMode =
  'numeric' | 'binary' | 'metricSavings' | 'manual' | 'informative' | 'notApplicable' | 'error';

export interface PsiAudit {
  id: string;
  title?: string;
  description?: string;
  score?: number | null;
  scoreDisplayMode?: PsiScoreDisplayMode;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
  metricSavings?: Partial<Record<'LCP' | 'FCP' | 'TBT' | 'CLS' | 'INP', number>>;
  details?: {
    type?: string;
    overallSavingsMs?: number;
    data?: string;
  };
}

export interface PsiFieldMetric {
  percentile?: number;
  category?: 'FAST' | 'AVERAGE' | 'SLOW' | 'NONE';
}

export interface PsiLoadingExperience {
  id?: string;
  overall_category?: 'FAST' | 'AVERAGE' | 'SLOW' | 'NONE';
  metrics?: Record<string, PsiFieldMetric | undefined>;
}

export interface PsiLighthouseResult {
  requestedUrl?: string;
  finalUrl?: string;
  finalDisplayedUrl?: string;
  fetchTime?: string;
  lighthouseVersion?: string;
  runtimeError?: { code?: string; message?: string };
  configSettings?: { formFactor?: 'mobile' | 'desktop' };
  categories?: Partial<
    Record<'performance' | 'accessibility' | 'best-practices' | 'seo', PsiCategory>
  >;
  audits?: Record<string, PsiAudit | undefined>;
}

export interface PsiResponse {
  id?: string;
  loadingExperience?: PsiLoadingExperience;
  originLoadingExperience?: PsiLoadingExperience;
  lighthouseResult?: PsiLighthouseResult;
  analysisUTCTimestamp?: string;
}

export interface PsiErrorBody {
  error?: { code?: number; message?: string; status?: string };
}

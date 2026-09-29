import type { CategoryKey, FieldMetricId, LabMetricId, Rating } from './types';

/**
 * "Good" and "poor" boundaries published by Google.
 * Core Web Vitals: https://web.dev/articles/vitals
 * Lab metrics: https://developer.chrome.com/docs/lighthouse/performance/performance-scoring
 */
const METRIC_THRESHOLDS: Record<
  LabMetricId | FieldMetricId,
  readonly [good: number, poor: number]
> = {
  lcp: [2500, 4000],
  fcp: [1800, 3000],
  inp: [200, 500],
  cls: [0.1, 0.25],
  tbt: [200, 600],
  si: [3400, 5800],
  ttfb: [800, 1800],
};

export function rateMetric(id: LabMetricId | FieldMetricId, value: number): Rating {
  const [good, poor] = METRIC_THRESHOLDS[id];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

export function metricThresholds(id: LabMetricId | FieldMetricId): readonly [number, number] {
  return METRIC_THRESHOLDS[id];
}

/** Lighthouse's own score bands: 90–100 good, 50–89 needs improvement, 0–49 poor. */
export function rateScore(score: number): Rating {
  if (score >= 90) return 'good';
  if (score >= 50) return 'needs-improvement';
  return 'poor';
}

export const CATEGORY_ORDER: readonly CategoryKey[] = [
  'performance',
  'accessibility',
  'bestPractices',
  'seo',
];

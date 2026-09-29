/**
 * Verdict's own domain model. The UI never touches the raw PageSpeed payload:
 * the server normalizes ~1 MB of Lighthouse JSON into this compact shape.
 */

export type Strategy = 'mobile' | 'desktop';

export type CategoryKey = 'performance' | 'accessibility' | 'bestPractices' | 'seo';

export type Rating = 'good' | 'needs-improvement' | 'poor';

export type LabMetricId = 'fcp' | 'lcp' | 'tbt' | 'cls' | 'si';
export type FieldMetricId = 'lcp' | 'inp' | 'cls' | 'fcp' | 'ttfb';

export interface LabMetric {
  id: LabMetricId;
  /** Milliseconds, except CLS which is unitless. */
  value: number;
  display: string;
  rating: Rating;
}

export interface FieldMetric {
  id: FieldMetricId;
  /** 75th percentile of real Chrome users. Milliseconds, except CLS. */
  p75: number;
  rating: Rating;
}

export interface FieldData {
  /** True when page-level data was missing and the whole origin was used instead. */
  isOriginFallback: boolean;
  overall: Rating | null;
  metrics: FieldMetric[];
}

export type Severity = 'critical' | 'warning';

export interface Finding {
  id: string;
  category: CategoryKey;
  title: string;
  description: string;
  severity: Severity;
  /** Estimated time savings in milliseconds, when Lighthouse provides one. */
  savingsMs: number | null;
}

export interface AuditReport {
  requestedUrl: string;
  finalUrl: string;
  strategy: Strategy;
  fetchedAt: string;
  lighthouseVersion: string | null;
  scores: Record<CategoryKey, number | null>;
  lab: LabMetric[];
  field: FieldData | null;
  findings: Finding[];
  screenshot: string | null;
}

export type ApiErrorCode = 'INVALID_URL' | 'RATE_LIMITED' | 'UNREACHABLE' | 'TIMEOUT' | 'UPSTREAM';

export interface ApiErrorBody {
  error: { code: ApiErrorCode; message: string };
}

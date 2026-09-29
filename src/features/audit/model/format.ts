import type { FieldMetricId, LabMetricId } from './types';

/** Formats a metric the way Lighthouse does: seconds above 1 s, milliseconds below, CLS unitless. */
export function formatMetric(
  id: LabMetricId | FieldMetricId,
  value: number,
  locale: string,
): string {
  if (id === 'cls') {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value);
  }
  if (value >= 1000) {
    const seconds = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    }).format(value / 1000);
    return `${seconds} s`;
  }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)} ms`;
}

export function formatSavings(ms: number, locale: string): string {
  return formatMetric('lcp', ms, locale);
}

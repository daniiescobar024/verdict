import type { CSSProperties } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n';
import { formatMetric } from '../model/format';
import { metricThresholds } from '../model/thresholds';
import type { FieldMetricId, LabMetricId, Rating } from '../model/types';
import styles from './MetricRow.module.css';

interface MetricRowProps {
  id: LabMetricId | FieldMetricId;
  value: number;
  display?: string;
  rating: Rating;
}

/** One metric, with a scale that shows where it lands against Google's thresholds. */
export function MetricRow({ id, value, display, rating }: MetricRowProps) {
  const { t, locale } = useI18n();
  const [good, poor] = metricThresholds(id);
  const max = poor * 1.6;
  const position = Math.min(Math.max(value / max, 0.015), 0.985);
  const formatted = display || formatMetric(id, value, locale);

  const style = {
    '--good-w': `${(good / max) * 100}%`,
    '--ni-w': `${((poor - good) / max) * 100}%`,
    '--pos': `${position * 100}%`,
  } as CSSProperties;

  return (
    <li className={styles.row} data-rating={rating}>
      <p className={styles.name}>
        {t(`metric.${id}`)}
        <span className={styles.abbr}>{id.toUpperCase()}</span>
      </p>
      <p className={styles.value}>
        <span className={styles.dot} aria-hidden="true" />
        <span>
          {formatted}
          <span className="visually-hidden">, {t(`rating.${rating}`)}</span>
        </span>
      </p>
      <p className={styles.why}>{t(`metric.${id}.why`)}</p>
      <div className={styles.scale} style={style} aria-hidden="true">
        <span />
        <span />
        <span />
        <i className={styles.marker} />
      </div>
      <p className={styles.target}>
        {t('metric.target', { value: formatMetric(id, good, locale) })}
      </p>
    </li>
  );
}

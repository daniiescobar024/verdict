import type { CSSProperties } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n';
import { rateScore } from '../model/thresholds';
import styles from './ScoreDial.module.css';

interface ScoreDialProps {
  label: string;
  score: number | null;
  delayMs?: number;
}

export function ScoreDial({ label, score, delayMs = 0 }: ScoreDialProps) {
  const { t } = useI18n();
  const rating = score === null ? null : rateScore(score);
  const aria =
    score === null
      ? `${label}: ${t('score.na')}`
      : t('score.aria', { label, score, rating: t(`rating.${rating ?? 'poor'}`) });

  const style = {
    '--offset': 100 - (score ?? 0),
    '--delay': `${delayMs}ms`,
  } as CSSProperties;

  return (
    <figure className={styles.dial} data-rating={rating ?? undefined} role="img" aria-label={aria}>
      <svg className={styles.ring} viewBox="0 0 120 120" aria-hidden="true" style={style}>
        <circle className={styles.track} cx="60" cy="60" r="54" fill="none" strokeWidth="2" />
        {score !== null && (
          <circle
            className={styles.progress}
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="3.5"
            pathLength={100}
          />
        )}
      </svg>
      <span className={styles.value} aria-hidden="true">
        {score ?? '—'}
      </span>
      <figcaption className={styles.label} aria-hidden="true">
        {label}
      </figcaption>
    </figure>
  );
}

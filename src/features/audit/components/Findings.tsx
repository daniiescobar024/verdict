import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n';
import { formatSavings } from '../model/format';
import { CATEGORY_ORDER } from '../model/thresholds';
import type { CategoryKey, Finding } from '../model/types';
import { RichText } from './RichText';
import styles from './Findings.module.css';

type Filter = CategoryKey | 'all';

export function Findings({ findings }: { findings: Finding[] }) {
  const { t, locale } = useI18n();
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => {
    const map = new Map<CategoryKey, number>();
    for (const finding of findings) map.set(finding.category, (map.get(finding.category) ?? 0) + 1);
    return map;
  }, [findings]);

  if (findings.length === 0) return <p className={styles.empty}>{t('findings.empty')}</p>;

  const visible = filter === 'all' ? findings : findings.filter((f) => f.category === filter);
  const filters: Filter[] = ['all', ...CATEGORY_ORDER.filter((key) => counts.has(key))];

  return (
    <>
      <div
        className={styles.filters}
        role="group"
        aria-label={t('findings.filter')}
        data-print="hide"
      >
        {filters.map((key) => (
          <button
            key={key}
            type="button"
            className={styles.chip}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {key === 'all' ? t('findings.all') : t(`score.${key}`)}
            <span className={styles.count}>
              {key === 'all' ? findings.length : counts.get(key)}
            </span>
          </button>
        ))}
      </div>
      <ul className={styles.list} role="list">
        {visible.map((finding) => (
          <li key={finding.id} className={styles.item}>
            <details>
              <summary className={styles.summary}>
                <span className={styles.badge} data-severity={finding.severity}>
                  {t(finding.severity === 'critical' ? 'findings.critical' : 'findings.warning')}
                </span>
                <span className={styles.title}>
                  <RichText text={finding.title} />
                </span>
                {finding.savingsMs !== null && (
                  <span className={styles.savings}>
                    {t('findings.savings', { value: formatSavings(finding.savingsMs, locale) })}
                  </span>
                )}
              </summary>
              <p className={styles.body}>
                <RichText text={finding.description} linkLabel={t('findings.learn')} />
              </p>
            </details>
          </li>
        ))}
      </ul>
    </>
  );
}

import { Fragment } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n';
import { compareReports, type CompareRow } from '../model/compare';
import { formatMetric } from '../model/format';
import { displayUrl } from '../model/params';
import type { AuditReport } from '../model/types';
import styles from './CompareTable.module.css';

export function CompareTable({ a, b }: { a: AuditReport; b: AuditReport }) {
  const { t, locale } = useI18n();
  const { rows, wins, total } = compareReports(a, b);
  const nameA = displayUrl(a.requestedUrl);
  const nameB = displayUrl(b.requestedUrl);

  const format = (row: CompareRow, value: number | null) => {
    if (value === null) return '—';
    return row.kind === 'score' ? String(value) : formatMetric(row.id, value, locale);
  };
  const label = (row: CompareRow) =>
    row.kind === 'score' ? t(`score.${row.id}`) : t(`metric.${row.id}`);
  const leaderName = (row: CompareRow) =>
    row.leader === 'a'
      ? nameA
      : row.leader === 'b'
        ? nameB
        : row.leader === 'tie'
          ? t('compare.tie')
          : '—';

  const leading =
    wins.a === wins.b
      ? null
      : wins.a > wins.b
        ? { url: nameA, count: wins.a }
        : { url: nameB, count: wins.b };

  return (
    <>
      {leading && (
        <p className={styles.summary}>
          {t('compare.faster', { url: leading.url, count: leading.count, total })}
        </p>
      )}
      <div className={styles.wrap}>
        <table className={styles.table}>
          <caption className="visually-hidden">{t('compare.title')}</caption>
          <thead>
            <tr>
              <th scope="col">{t('compare.metric')}</th>
              <th scope="col">{nameA}</th>
              <th scope="col">{nameB}</th>
              <th scope="col">{t('compare.lead.label')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <Fragment key={row.id + row.kind}>
                {index === 4 && (
                  <tr className={styles.groupRow}>
                    <th scope="rowgroup" colSpan={4}>
                      {t('lab.title')}
                    </th>
                  </tr>
                )}
                <tr>
                  <th scope="row">{label(row)}</th>
                  <td className={styles.value} data-lead={row.leader === 'a'}>
                    {format(row, row.a)}
                  </td>
                  <td className={styles.value} data-lead={row.leader === 'b'}>
                    {format(row, row.b)}
                  </td>
                  <td className={styles.leader}>{leaderName(row)}</td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

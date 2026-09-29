import { Link } from 'react-router-dom';
import { useI18n } from '../../../shared/i18n/useI18n';
import { Button } from '../../../shared/ui/Button';
import { Icon } from '../../../shared/ui/Icon';
import { useAuditHistory } from '../hooks/useAuditHistory';
import { displayUrl } from '../model/params';
import { rateScore } from '../model/thresholds';
import { reportPath } from '../routes';
import styles from './HistoryList.module.css';

export function HistoryList() {
  const { t } = useI18n();
  const { entries, clear } = useAuditHistory();
  if (entries.length === 0) return null;

  return (
    <section className={styles.wrap} aria-labelledby="recent-title">
      <div className={styles.head}>
        <h2 id="recent-title" className="eyebrow">
          {t('home.recent')}
        </h2>
        <Button variant="quiet" onClick={clear}>
          {t('home.clearRecent')}
        </Button>
      </div>
      <ul className={styles.list} role="list">
        {entries.map((entry) => (
          <li key={`${entry.strategy}:${entry.url}`}>
            <Link className={styles.link} to={reportPath(entry.url, entry.strategy)}>
              <Icon name={entry.strategy} className={styles.device} />
              <span className={styles.url}>{displayUrl(entry.url)}</span>
              <span
                className={styles.score}
                data-rating={entry.performance === null ? undefined : rateScore(entry.performance)}
              >
                {entry.performance ?? '—'}
                <span className="visually-hidden"> / 100 {t('score.performance')}</span>
              </span>
              <Icon name="arrow" className={styles.arrow} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

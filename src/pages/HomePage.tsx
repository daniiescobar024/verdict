import { useI18n } from '../shared/i18n/useI18n';
import type { MessageKey } from '../shared/i18n/messages';
import { AuditForm } from '../features/audit/components/AuditForm';
import { HistoryList } from '../features/audit/components/HistoryList';
import styles from './Page.module.css';

const PILLARS: { title: MessageKey; body: MessageKey }[] = [
  { title: 'home.pillar.speed.title', body: 'home.pillar.speed.body' },
  { title: 'home.pillar.trust.title', body: 'home.pillar.trust.body' },
  { title: 'home.pillar.search.title', body: 'home.pillar.search.body' },
];

export function HomePage() {
  const { t } = useI18n();
  // Copy marks the emphasised phrase with *asterisks* so each language chooses its own.
  const [before, emphasis, after] = t('home.title').split('*');

  return (
    <div className="container">
      <title>{`Verdict — ${t('meta.tagline')}`}</title>
      <section className={styles.hero} aria-labelledby="home-title">
        <p className="eyebrow rise">{t('home.eyebrow')}</p>
        <h1 id="home-title" className={`${styles.title} rise`} style={{ animationDelay: '80ms' }}>
          {before}
          {emphasis && <em>{emphasis}</em>}
          {after}
        </h1>
        <p className={`${styles.lead} rise`} style={{ animationDelay: '160ms' }}>
          {t('home.lead')}
        </p>
        <div className={`${styles.formSlot} rise`} style={{ animationDelay: '240ms' }}>
          <AuditForm />
        </div>
      </section>

      <section className={styles.pillars} aria-label={t('home.eyebrow')}>
        {PILLARS.map((pillar, index) => (
          <article key={pillar.title} className={styles.pillar}>
            <span className={styles.num} aria-hidden="true">
              0{index + 1}
            </span>
            <h2>{t(pillar.title)}</h2>
            <p>{t(pillar.body)}</p>
          </article>
        ))}
      </section>

      <div className={styles.history}>
        <HistoryList />
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { MessageKey } from '../../../shared/i18n/messages';
import { displayUrl } from '../model/params';
import type { Strategy } from '../model/types';
import styles from './States.module.css';

const STEPS: MessageKey[] = [
  'loading.step.1',
  'loading.step.2',
  'loading.step.3',
  'loading.step.4',
  'loading.step.5',
];
const STEP_MS = 7000;

/**
 * Lighthouse takes 20–40 s. A bare spinner feels broken at that length, so the
 * wait is narrated with the stages Lighthouse actually goes through.
 */
export function LoadingState({ url, strategy }: { url: string; strategy: Strategy }) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((step) => Math.min(step + 1, STEPS.length - 1)),
      STEP_MS,
    );
    return () => window.clearInterval(timer);
  }, []);

  // Keep the URL as one visual unit so the heading never breaks at a hyphen.
  const [before, after] = t('loading.title', { url: '\u0000' }).split('\u0000');
  const device = t(strategy === 'mobile' ? 'form.mobile' : 'form.desktop').toLowerCase();

  return (
    <section
      className={`${styles.state} container`}
      aria-busy="true"
      aria-labelledby="loading-title"
    >
      <p className="eyebrow">Lighthouse</p>
      <h1 id="loading-title">
        {before}
        <span className={styles.url}>{displayUrl(url)}</span>
        {after}
      </h1>
      <p className={styles.note}>{t('loading.note')}</p>
      <div
        className={styles.progress}
        role="progressbar"
        aria-label={t('loading.title', { url: displayUrl(url) })}
      />
      <ol className={styles.steps} role="list">
        {STEPS.map((key, index) => (
          <li
            key={key}
            className={styles.step}
            data-status={index < active ? 'done' : index === active ? 'active' : 'pending'}
            aria-current={index === active ? 'step' : undefined}
          >
            {t(key, { device })}
          </li>
        ))}
      </ol>
      <p className="visually-hidden" aria-live="polite">
        {t(STEPS[active] ?? 'loading.step.1', { device })}
      </p>
    </section>
  );
}

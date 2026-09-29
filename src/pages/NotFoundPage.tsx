import { Link } from 'react-router-dom';
import { useI18n } from '../shared/i18n/useI18n';
import { buttonClass } from '../shared/ui/button-class';
import styles from './Page.module.css';

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <section className={`${styles.notFound} container`}>
      <title>404 · Verdict</title>
      <p className="eyebrow">404</p>
      <h1>{t('notFound.title')}</h1>
      <p className="muted">{t('notFound.body')}</p>
      <p>
        <Link className={buttonClass('primary')} to="/">
          {t('error.newAudit')}
        </Link>
      </p>
    </section>
  );
}

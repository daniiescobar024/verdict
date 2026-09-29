import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../shared/i18n/useI18n';
import { Button } from '../../../shared/ui/Button';
import { buttonClass, iconClass } from '../../../shared/ui/button-class';
import { Icon } from '../../../shared/ui/Icon';
import { AuditError } from '../api/client';
import styles from './States.module.css';

export function ErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const { t } = useI18n();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const code = error instanceof AuditError ? error.code : 'UPSTREAM';

  // Move focus so keyboard and screen-reader users land on the problem.
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <section className={`${styles.state} container`} role="alert" aria-labelledby="error-title">
      <p className={styles.code}>{code}</p>
      <h1 id="error-title" ref={headingRef} tabIndex={-1}>
        {t('error.title')}
      </h1>
      <p className={styles.note}>{t(`error.${code}`)}</p>
      <div className={styles.actions}>
        {code !== 'INVALID_URL' && (
          <Button onClick={onRetry}>
            <Icon name="refresh" className={iconClass} />
            {t('error.retry')}
          </Button>
        )}
        <Link className={buttonClass('ghost')} to="/">
          {t('error.newAudit')}
        </Link>
      </div>
    </section>
  );
}

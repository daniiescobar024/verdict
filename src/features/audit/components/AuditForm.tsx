import { useId, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../../shared/i18n/useI18n';
import { Button } from '../../../shared/ui/Button';
import { iconClass } from '../../../shared/ui/button-class';
import { Icon } from '../../../shared/ui/Icon';
import { SegmentedControl } from '../../../shared/ui/SegmentedControl';
import { normalizeUrl } from '../model/params';
import type { Strategy } from '../model/types';
import { reportPath } from '../routes';
import styles from './AuditForm.module.css';

interface AuditFormProps {
  initialUrl?: string;
  initialStrategy?: Strategy;
}

export function AuditForm({ initialUrl = '', initialStrategy = 'mobile' }: AuditFormProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialUrl);
  const [strategy, setStrategy] = useState<Strategy>(initialStrategy);
  const [invalid, setInvalid] = useState(false);
  const inputId = useId();
  const messageId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = normalizeUrl(value);
    if (!url) {
      setInvalid(true);
      inputRef.current?.focus();
      return;
    }
    setInvalid(false);
    void navigate(reportPath(url, strategy));
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate role="search">
      <div className={styles.bar} data-invalid={invalid}>
        <div className={styles.field}>
          <label htmlFor={inputId} className="visually-hidden">
            {t('form.label')}
          </label>
          <span className={styles.prefix} aria-hidden="true">
            https://
          </span>
          <input
            ref={inputRef}
            id={inputId}
            className={styles.input}
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={t('form.placeholder')}
            value={value}
            aria-invalid={invalid}
            aria-describedby={messageId}
            onChange={(event) => {
              setValue(event.target.value);
              if (invalid) setInvalid(false);
            }}
          />
        </div>
        <div className={styles.controls}>
          <SegmentedControl
            legend={t('form.device')}
            value={strategy}
            onChange={setStrategy}
            options={[
              {
                value: 'mobile',
                label: (
                  <>
                    <Icon name="mobile" className={iconClass} />
                    {t('form.mobile')}
                  </>
                ),
              },
              {
                value: 'desktop',
                label: (
                  <>
                    <Icon name="desktop" className={iconClass} />
                    {t('form.desktop')}
                  </>
                ),
              },
            ]}
          />
          <Button type="submit" className={styles.submit}>
            {t('form.submit')}
            <Icon name="arrow" className={iconClass} />
          </Button>
        </div>
      </div>
      <p id={messageId} className={styles.message} data-error={invalid} aria-live="polite">
        {invalid ? t('form.invalid') : t('form.hint')}
      </p>
    </form>
  );
}

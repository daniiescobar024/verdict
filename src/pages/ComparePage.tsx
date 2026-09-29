import { useQueries } from '@tanstack/react-query';
import { useId, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { auditQuery } from '../features/audit/api/client';
import { CompareTable } from '../features/audit/components/CompareTable';
import { ErrorState } from '../features/audit/components/ErrorState';
import { LoadingState } from '../features/audit/components/LoadingState';
import { displayUrl, normalizeUrl, parseStrategy } from '../features/audit/model/params';
import type { Strategy } from '../features/audit/model/types';
import { comparePath, reportPath } from '../features/audit/routes';
import { useI18n } from '../shared/i18n/useI18n';
import { Button } from '../shared/ui/Button';
import { buttonClass, iconClass } from '../shared/ui/button-class';
import { Icon } from '../shared/ui/Icon';
import { SegmentedControl } from '../shared/ui/SegmentedControl';
import styles from './Page.module.css';

function CompareResults({ a, b, strategy }: { a: string; b: string; strategy: Strategy }) {
  const { t } = useI18n();
  // Both audits run in parallel; the slower one sets the pace.
  const [first, second] = useQueries({
    queries: [auditQuery(a, strategy), auditQuery(b, strategy)],
  });

  if (!first || !second) return null;
  if (first.isError || second.isError) {
    return (
      <ErrorState
        error={first.error ?? second.error}
        onRetry={() => {
          if (first.isError) void first.refetch();
          if (second.isError) void second.refetch();
        }}
      />
    );
  }
  if (!first.data || !second.data) {
    return <LoadingState url={`${displayUrl(a)} · ${displayUrl(b)}`} strategy={strategy} />;
  }
  return (
    <section className={styles.results} aria-label={t('compare.title')}>
      <CompareTable a={first.data} b={second.data} />
      <div className={styles.reportLinks}>
        {[a, b].map((url) => (
          <Link key={url} className={buttonClass('ghost')} to={reportPath(url, strategy)}>
            {displayUrl(url)}
            <Icon name="arrow" className={iconClass} />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function ComparePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const a = normalizeUrl(params.get('a') ?? '');
  const b = normalizeUrl(params.get('b') ?? '');
  const strategy = parseStrategy(params.get('strategy'));

  const [valueA, setValueA] = useState(a ? displayUrl(a) : '');
  const [valueB, setValueB] = useState(b ? displayUrl(b) : '');
  const [device, setDevice] = useState<Strategy>(strategy);
  const [invalid, setInvalid] = useState<{ a: boolean; b: boolean }>({ a: false, b: false });
  const idA = useId();
  const idB = useId();
  const errorId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextA = normalizeUrl(valueA);
    const nextB = normalizeUrl(valueB);
    setInvalid({ a: !nextA, b: !nextB });
    if (nextA && nextB) void navigate(comparePath(nextA, nextB, device));
  }

  const hasError = invalid.a || invalid.b;

  return (
    <div className="container">
      <title>{`${t('compare.title')} · Verdict`}</title>
      <div className={styles.compare}>
        <header className={styles.hero} style={{ paddingBlock: 0 }}>
          <p className="eyebrow">{t('nav.compare')}</p>
          <h1 className={styles.title}>{t('compare.title')}</h1>
          <p className={styles.lead}>{t('compare.lead')}</p>
        </header>

        <form className={styles.compareForm} onSubmit={handleSubmit} noValidate>
          {(
            [
              { id: idA, key: 'a', label: t('compare.a'), value: valueA, set: setValueA },
              { id: idB, key: 'b', label: t('compare.b'), value: valueB, set: setValueB },
            ] as const
          ).map((field) => (
            <div key={field.key} className={styles.field}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                id={field.id}
                className={styles.input}
                type="text"
                inputMode="url"
                autoCapitalize="none"
                spellCheck={false}
                placeholder={t('form.placeholder')}
                value={field.value}
                aria-invalid={invalid[field.key]}
                aria-describedby={hasError ? errorId : undefined}
                onChange={(event) => field.set(event.target.value)}
              />
            </div>
          ))}
          <div className={styles.compareFooter}>
            <SegmentedControl
              legend={t('form.device')}
              value={device}
              onChange={setDevice}
              options={[
                { value: 'mobile', label: t('form.mobile') },
                { value: 'desktop', label: t('form.desktop') },
              ]}
            />
            <Button type="submit">
              {t('compare.submit')}
              <Icon name="compare" className={iconClass} />
            </Button>
          </div>
          {hasError && (
            <p id={errorId} className={styles.error} role="alert">
              {t('form.invalid')}
            </p>
          )}
        </form>
      </div>
      {a && b && <CompareResults key={`${strategy}:${a}:${b}`} a={a} b={b} strategy={strategy} />}
    </div>
  );
}

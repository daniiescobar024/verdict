import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../shared/i18n/useI18n';
import { Button } from '../../../shared/ui/Button';
import { buttonClass, iconClass } from '../../../shared/ui/button-class';
import { Icon } from '../../../shared/ui/Icon';
import { displayUrl } from '../model/params';
import { CATEGORY_ORDER } from '../model/thresholds';
import type { AuditReport } from '../model/types';
import { getVerdictTone } from '../model/verdict';
import { comparePath, reportPath } from '../routes';
import { Findings } from './Findings';
import { MetricRow } from './MetricRow';
import { ScoreDial } from './ScoreDial';
import styles from './Report.module.css';

interface ReportViewProps {
  report: AuditReport;
  onRerun: () => void;
  isRefreshing: boolean;
}

interface SectionHeadProps {
  id: string;
  index: string;
  title: string;
  caption?: string;
}

function SectionHead({ id, index, title, caption }: SectionHeadProps) {
  return (
    <header className={styles.sectionHead}>
      <span className={styles.index} aria-hidden="true">
        {index}
      </span>
      <h2 id={id}>{title}</h2>
      {caption && <p className={styles.caption}>{caption}</p>}
    </header>
  );
}

export function ReportView({ report, onRerun, isRefreshing }: ReportViewProps) {
  const { t, formatDate } = useI18n();
  const [copied, setCopied] = useState(false);
  const tone = getVerdictTone(report);
  const device = t(report.strategy === 'mobile' ? 'form.mobile' : 'form.desktop');
  const other = report.strategy === 'mobile' ? 'desktop' : 'mobile';
  const redirected = displayUrl(report.finalUrl) !== displayUrl(report.requestedUrl);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the URL bar still has the shareable link.
    }
  }

  return (
    <article className={`${styles.report} container`}>
      <header className={`${styles.header} rise`}>
        <p className="eyebrow">{t('report.eyebrow')}</p>
        <h1 className={styles.title}>{displayUrl(report.requestedUrl)}</h1>
        <p className={styles.meta}>
          {t('report.audited', {
            date: formatDate(report.fetchedAt),
            device,
            version: report.lighthouseVersion ?? '—',
          })}
        </p>
        {redirected && (
          <p className={styles.meta}>
            {t('report.redirected', { url: displayUrl(report.finalUrl) })}
          </p>
        )}
        <div className={styles.actions} data-print="hide">
          <Button variant="ghost" onClick={onRerun} disabled={isRefreshing}>
            <Icon name="refresh" className={iconClass} />
            {t('report.rerun')}
          </Button>
          <Link className={buttonClass('ghost')} to={reportPath(report.requestedUrl, other)}>
            <Icon name={other} className={iconClass} />
            {t('report.switchTo', {
              device: t(other === 'mobile' ? 'form.mobile' : 'form.desktop').toLowerCase(),
            })}
          </Link>
          <Link
            className={buttonClass('ghost')}
            to={comparePath(report.requestedUrl, '', report.strategy)}
          >
            <Icon name="compare" className={iconClass} />
            {t('report.compare')}
          </Link>
          <Button variant="ghost" onClick={() => void copyLink()}>
            <Icon name={copied ? 'check' : 'link'} className={iconClass} />
            <span aria-live="polite">{copied ? t('report.copied') : t('report.share')}</span>
          </Button>
          <Button variant="ghost" onClick={() => window.print()}>
            <Icon name="print" className={iconClass} />
            {t('report.print')}
          </Button>
        </div>
      </header>

      <section className={styles.hero} aria-labelledby="verdict-title">
        <div
          className={`${styles.verdict} rise`}
          data-tone={tone}
          style={{ animationDelay: '120ms' }}
        >
          <h2 id="verdict-title" className={styles.verdictTitle}>
            {t(`verdict.${tone}.title`)}
          </h2>
          <p className={styles.verdictBody}>{t(`verdict.${tone}.body`)}</p>
        </div>
        {report.screenshot && (
          <figure
            className={`${styles.shot} rise`}
            data-strategy={report.strategy}
            style={{ animationDelay: '220ms' }}
          >
            <img
              src={report.screenshot}
              alt=""
              width={report.strategy === 'mobile' ? 412 : 1350}
              height={report.strategy === 'mobile' ? 823 : 940}
              decoding="async"
            />
            <figcaption>{t('report.screenshot', { device })}</figcaption>
          </figure>
        )}
      </section>

      <section className={styles.scores} aria-label={t('score.title')}>
        {CATEGORY_ORDER.map((key, i) => (
          <ScoreDial
            key={key}
            label={t(`score.${key}`)}
            score={report.scores[key]}
            delayMs={i * 120}
          />
        ))}
      </section>

      <div className={styles.split}>
        <section className={styles.section} aria-labelledby="lab-title">
          <SectionHead
            id="lab-title"
            index="01"
            title={t('lab.title')}
            caption={t('lab.caption', { device })}
          />
          <ul className={styles.metrics} role="list">
            {report.lab.map((metric) => (
              <MetricRow key={metric.id} {...metric} />
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="field-title">
          <SectionHead
            id="field-title"
            index="02"
            title={t('field.title')}
            caption={t('field.caption')}
          />
          {report.field ? (
            <>
              {report.field.overall && (
                <p className={styles.overall} data-rating={report.field.overall}>
                  {t('field.overall', { rating: t(`rating.${report.field.overall}`) })}
                </p>
              )}
              {report.field.isOriginFallback && <p className={styles.note}>{t('field.origin')}</p>}
              <ul className={styles.metrics} role="list">
                {report.field.metrics.map((metric) => (
                  <MetricRow
                    key={metric.id}
                    id={metric.id}
                    value={metric.p75}
                    rating={metric.rating}
                  />
                ))}
              </ul>
            </>
          ) : (
            <p className={styles.note}>{t('field.empty')}</p>
          )}
        </section>
      </div>

      <section className={styles.section} aria-labelledby="findings-title">
        <SectionHead
          id="findings-title"
          index="03"
          title={t('findings.title')}
          caption={t('findings.caption')}
        />
        <Findings findings={report.findings} />
      </section>
    </article>
  );
}

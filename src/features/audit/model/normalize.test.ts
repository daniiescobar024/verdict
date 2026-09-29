import { describe, expect, it } from 'vitest';
import { psiFixture } from '../../../test/utils';
import { NormalizeError, normalizeReport } from './normalize';
import type { PsiResponse } from './psi-types';

const clone = (): PsiResponse => structuredClone(psiFixture);
const run = (data: PsiResponse = clone()) =>
  normalizeReport(data, 'https://acme-plumbing.example/', 'mobile');

describe('normalizeReport', () => {
  it('converts category scores to 0–100', () => {
    expect(run().scores).toEqual({
      performance: 41,
      accessibility: 78,
      bestPractices: 96,
      seo: 83,
    });
  });

  it('keeps the redirect target and run metadata', () => {
    const report = run();
    expect(report.finalUrl).toBe('https://www.acme-plumbing.example/');
    expect(report.lighthouseVersion).toBe('12.8.2');
    expect(report.fetchedAt).toBe('2026-09-28T23:40:00.000Z');
  });

  it('rates lab metrics against Google thresholds', () => {
    const lab = Object.fromEntries(run().lab.map((m) => [m.id, m]));
    expect(lab.lcp).toMatchObject({ value: 5120.2, display: '5.1 s', rating: 'poor' });
    expect(lab.cls).toMatchObject({ value: 0.042, rating: 'good' });
    expect(lab.tbt?.rating).toBe('needs-improvement');
  });

  it('reads page-level field data and rescales CrUX CLS', () => {
    const field = run().field;
    expect(field?.isOriginFallback).toBe(false);
    expect(field?.overall).toBe('poor');
    expect(field?.metrics.find((m) => m.id === 'cls')).toEqual({
      id: 'cls',
      p75: 0.12,
      rating: 'needs-improvement',
    });
    expect(field?.metrics.find((m) => m.id === 'inp')?.rating).toBe('good');
  });

  it('falls back to origin data when the page has none', () => {
    const data = clone();
    delete data.loadingExperience;
    const field = run(data).field;
    expect(field?.isOriginFallback).toBe(true);
    expect(field?.overall).toBe('needs-improvement');
    expect(field?.metrics).toHaveLength(1);
  });

  it('returns null field data when Google has none at all', () => {
    const data = clone();
    delete data.loadingExperience;
    delete data.originLoadingExperience;
    expect(run(data).field).toBeNull();
  });

  it('lists only failing, scored audits — no metrics, passes, manual or N/A checks', () => {
    const ids = run().findings.map((f) => f.id);
    expect(ids).not.toContain('largest-contentful-paint');
    expect(ids).not.toContain('label');
    expect(ids).not.toContain('font-display-insight');
    expect(ids).not.toContain('logical-tab-order');
    expect(ids).not.toContain('aria-valid-attr');
    expect(ids).not.toContain('third-party-summary');
    expect(ids).not.toContain('final-screenshot');
  });

  it('orders by severity, then estimated savings, then weight, without duplicates', () => {
    expect(run().findings.map((f) => f.id)).toEqual([
      'render-blocking-insight',
      'unused-javascript',
      'image-alt',
      'color-contrast',
      'errors-in-console',
      'meta-description',
      'image-delivery-insight',
      'link-text',
    ]);
  });

  it('estimates savings from overallSavingsMs or LCP metric savings', () => {
    const byId = Object.fromEntries(run().findings.map((f) => [f.id, f]));
    expect(byId['unused-javascript']?.savingsMs).toBe(900);
    expect(byId['render-blocking-insight']?.savingsMs).toBe(1350);
    expect(byId['color-contrast']?.savingsMs).toBeNull();
    expect(byId['image-alt']?.category).toBe('accessibility');
  });

  it('keeps the screenshot only when it is an image data URI', () => {
    expect(run().screenshot).toMatch(/^data:image\//);
    const data = clone();
    data.lighthouseResult!.audits!['final-screenshot']!.details!.data =
      'https://evil.example/x.png';
    expect(run(data).screenshot).toBeNull();
  });

  it('degrades gracefully when a category is missing', () => {
    const data = clone();
    delete data.lighthouseResult!.categories!.seo;
    expect(run(data).scores.seo).toBeNull();
  });

  it('throws a typed error when Lighthouse returned nothing usable', () => {
    expect(() => run({})).toThrow(NormalizeError);
  });
});

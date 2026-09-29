import { describe, expect, it } from 'vitest';
import { reportFixture } from '../../../test/utils';
import { compareReports } from './compare';
import { getVerdictTone } from './verdict';

describe('compareReports', () => {
  it('prefers higher scores and lower metric values', () => {
    const a = reportFixture();
    const b = reportFixture();
    b.scores.performance = 88;
    b.lab = b.lab.map((m) => (m.id === 'lcp' ? { ...m, value: 2100 } : m));

    const { rows, wins } = compareReports(a, b);
    expect(rows.find((r) => r.id === 'performance')?.leader).toBe('b');
    expect(rows.find((r) => r.kind === 'metric' && r.id === 'lcp')?.leader).toBe('b');
    expect(rows.find((r) => r.id === 'seo')?.leader).toBe('tie');
    expect(wins).toEqual({ a: 0, b: 2 });
  });

  it('treats lab differences within 5% as a tie', () => {
    const a = reportFixture();
    const b = reportFixture();
    b.lab = b.lab.map((m) => (m.id === 'tbt' ? { ...m, value: m.value * 1.03 } : m));
    expect(
      compareReports(a, b).rows.find((r) => r.kind === 'metric' && r.id === 'tbt')?.leader,
    ).toBe('tie');
  });

  it('cannot pick a leader when one side is missing', () => {
    const a = reportFixture();
    const b = reportFixture();
    b.scores.accessibility = null;
    expect(compareReports(a, b).rows.find((r) => r.id === 'accessibility')?.leader).toBeNull();
  });
});

describe('getVerdictTone', () => {
  it('trusts real-user data over the lab score', () => {
    const report = reportFixture();
    report.scores.performance = 95;
    expect(getVerdictTone(report)).toBe('poor');
  });

  it('uses the lab score when only origin-level data exists', () => {
    const report = reportFixture();
    report.field = { isOriginFallback: true, overall: 'good', metrics: [] };
    expect(getVerdictTone(report)).toBe('poor');
  });

  it('is unknown without any performance signal', () => {
    const report = reportFixture();
    report.field = null;
    report.scores.performance = null;
    expect(getVerdictTone(report)).toBe('unknown');
  });
});

import { describe, expect, it } from 'vitest';
import { rateMetric, rateScore } from './thresholds';

describe('rateMetric', () => {
  it('treats the published threshold itself as passing', () => {
    expect(rateMetric('lcp', 2500)).toBe('good');
    expect(rateMetric('lcp', 2501)).toBe('needs-improvement');
    expect(rateMetric('lcp', 4000)).toBe('needs-improvement');
    expect(rateMetric('lcp', 4001)).toBe('poor');
  });

  it('handles unitless CLS', () => {
    expect(rateMetric('cls', 0.05)).toBe('good');
    expect(rateMetric('cls', 0.2)).toBe('needs-improvement');
    expect(rateMetric('cls', 0.3)).toBe('poor');
  });
});

describe('rateScore', () => {
  it('follows the Lighthouse colour bands', () => {
    expect(rateScore(100)).toBe('good');
    expect(rateScore(90)).toBe('good');
    expect(rateScore(89)).toBe('needs-improvement');
    expect(rateScore(50)).toBe('needs-improvement');
    expect(rateScore(49)).toBe('poor');
  });
});

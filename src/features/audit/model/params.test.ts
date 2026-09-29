import { describe, expect, it } from 'vitest';
import { displayUrl, normalizeUrl, parseStrategy } from './params';

describe('normalizeUrl', () => {
  it.each([
    ['acme.com', 'https://acme.com/'],
    ['  acme.com/pricing  ', 'https://acme.com/pricing'],
    ['http://acme.com', 'http://acme.com/'],
    ['https://www.acme.com/a?b=1#section', 'https://www.acme.com/a?b=1'],
    ['HTTPS://ACME.COM', 'https://acme.com/'],
  ])('accepts %j', (input, expected) => {
    expect(normalizeUrl(input)).toBe(expected);
  });

  it.each([
    '',
    'not a url',
    'acme',
    'ftp://acme.com',
    'javascript:alert(1)',
    'https://user:pass@acme.com',
    'http://localhost:3000',
    'http://192.168.0.10',
    'http://10.0.0.1',
    'http://127.0.0.1',
  ])('rejects %j', (input) => {
    expect(normalizeUrl(input)).toBeNull();
  });
});

describe('parseStrategy', () => {
  it('defaults to mobile for anything but "desktop"', () => {
    expect(parseStrategy('desktop')).toBe('desktop');
    expect(parseStrategy('mobile')).toBe('mobile');
    expect(parseStrategy(null)).toBe('mobile');
    expect(parseStrategy('tablet')).toBe('mobile');
  });
});

describe('displayUrl', () => {
  it('strips protocol, www and a trailing slash', () => {
    expect(displayUrl('https://www.acme.com/')).toBe('acme.com');
    expect(displayUrl('http://acme.com/pricing/')).toBe('acme.com/pricing');
  });
});

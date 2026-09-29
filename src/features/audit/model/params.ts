import type { Strategy } from './types.js';

const PRIVATE_HOST =
  /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.0\.0\.0|\[?::1\]?$)/i;

/**
 * Turns whatever the user typed into a canonical, auditable URL — or `null`.
 * Accepts bare domains ("acme.com"), adds https, rejects non-web protocols and
 * private hosts that Google's servers could never reach anyway.
 */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed || /\s/.test(trimmed)) return null;

  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    return null;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (url.username || url.password) return null;
  if (!url.hostname.includes('.') || url.hostname.endsWith('.')) return null;
  if (PRIVATE_HOST.test(url.hostname)) return null;

  url.hash = '';
  return url.toString();
}

export function parseStrategy(value: string | null | undefined): Strategy {
  return value === 'desktop' ? 'desktop' : 'mobile';
}

/** Human-friendly label: drops protocol, "www." and a lone trailing slash. */
export function displayUrl(url: string): string {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

import { describe, expect, it, vi } from 'vitest';
import { jsonResponse, psiFixture } from '../src/test/utils';
import { handleAudit } from './handle-audit';

const request = (query: string) => new Request(`https://verdict.test/api/audit?${query}`);

describe('handleAudit', () => {
  it('rejects invalid URLs without calling Google', async () => {
    const fetchMock = vi.fn();
    const response = await handleAudit(request('url=localhost'), 'KEY', fetchMock);
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: { code: 'INVALID_URL' } });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('calls PageSpeed with every category, the strategy and the server-side key', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(psiFixture));
    await handleAudit(request('url=acme.com&strategy=desktop'), 'SECRET', fetchMock);

    const called = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(called.searchParams.get('url')).toBe('https://acme.com/');
    expect(called.searchParams.get('strategy')).toBe('desktop');
    expect(called.searchParams.get('key')).toBe('SECRET');
    expect(called.searchParams.getAll('category')).toEqual([
      'PERFORMANCE',
      'ACCESSIBILITY',
      'BEST_PRACTICES',
      'SEO',
    ]);
  });

  it('returns a compact, CDN-cacheable report', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(psiFixture));
    const response = await handleAudit(request('url=acme.com'), undefined, fetchMock);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toContain('s-maxage');
    expect(body.scores.performance).toBe(41);
    expect(body).not.toHaveProperty('lighthouseResult');
  });

  it('maps a quota error to RATE_LIMITED', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        jsonResponse(
          { error: { code: 429, status: 'RESOURCE_EXHAUSTED', message: 'Quota exceeded' } },
          429,
        ),
      );
    const response = await handleAudit(request('url=acme.com'), undefined, fetchMock);
    expect(response.status).toBe(429);
    expect(await response.json()).toMatchObject({ error: { code: 'RATE_LIMITED' } });
  });

  it('maps an unreachable site to UNREACHABLE', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: 500,
            message:
              'Lighthouse returned error: FAILED_DOCUMENT_REQUEST. net::ERR_NAME_NOT_RESOLVED',
          },
        },
        500,
      ),
    );
    const response = await handleAudit(request('url=acme.com'), undefined, fetchMock);
    expect(await response.json()).toMatchObject({ error: { code: 'UNREACHABLE' } });
  });

  it('detects a Lighthouse runtime error inside a 200 response', async () => {
    const data = structuredClone(psiFixture);
    data.lighthouseResult!.runtimeError = {
      code: 'NO_FCP',
      message: 'The page did not paint any content.',
    };
    const response = await handleAudit(
      request('url=acme.com'),
      undefined,
      vi.fn().mockResolvedValue(jsonResponse(data)),
    );
    expect(response.status).toBe(422);
  });

  it('reports a timeout distinctly from other network failures', async () => {
    const timeout = vi.fn().mockRejectedValue(new DOMException('timed out', 'TimeoutError'));
    const offline = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
    expect(
      await (await handleAudit(request('url=acme.com'), undefined, timeout)).json(),
    ).toMatchObject({
      error: { code: 'TIMEOUT' },
    });
    expect(
      await (await handleAudit(request('url=acme.com'), undefined, offline)).json(),
    ).toMatchObject({
      error: { code: 'UPSTREAM' },
    });
  });

  it('never caches errors', async () => {
    const response = await handleAudit(request('url=nope'), undefined, vi.fn());
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});

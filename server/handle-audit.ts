import { normalizeReport } from '../src/features/audit/model/normalize.js';
import { normalizeUrl, parseStrategy } from '../src/features/audit/model/params.js';
import type { PsiErrorBody, PsiResponse } from '../src/features/audit/model/psi-types.js';
import type { ApiErrorBody, ApiErrorCode } from '../src/features/audit/model/types.js';

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const CATEGORIES = ['PERFORMANCE', 'ACCESSIBILITY', 'BEST_PRACTICES', 'SEO'];
const UPSTREAM_TIMEOUT_MS = 55_000;
/** Lighthouse localizes audit titles and descriptions; only the app's own languages are forwarded. */
const LOCALES = new Set(['en', 'es']);
const UNREACHABLE_MARKERS = [
  'FAILED_DOCUMENT_REQUEST',
  'ERRORED_DOCUMENT_REQUEST',
  'DNS_FAILURE',
  'NO_FCP',
  'NOT_HTML',
  'PROTOCOL_TIMEOUT',
];

const STATUS: Record<ApiErrorCode, number> = {
  INVALID_URL: 400,
  RATE_LIMITED: 429,
  UNREACHABLE: 422,
  TIMEOUT: 504,
  UPSTREAM: 502,
};

function json(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}

function fail(code: ApiErrorCode, message: string): Response {
  const body: ApiErrorBody = { error: { code, message } };
  return json(body, STATUS[code], { 'Cache-Control': 'no-store' });
}

function classifyUpstream(status: number, body: PsiErrorBody): ApiErrorCode {
  const text = `${body.error?.status ?? ''} ${body.error?.message ?? ''}`;
  if (status === 429 || text.includes('RESOURCE_EXHAUSTED')) return 'RATE_LIMITED';
  if (UNREACHABLE_MARKERS.some((marker) => text.includes(marker))) return 'UNREACHABLE';
  if (status === 400) return 'INVALID_URL';
  return 'UPSTREAM';
}

/**
 * Platform-agnostic handler (Web `Request` → `Response`), shared by the Vercel
 * function and the Vite dev server. It keeps the API key server-side, trims the
 * ~1 MB Lighthouse payload down to what the UI needs, and lets the CDN cache it.
 */
export async function handleAudit(
  request: Request,
  apiKey: string | undefined,
  fetchImpl: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== 'GET') return fail('INVALID_URL', 'Only GET is supported');

  const params = new URL(request.url).searchParams;
  const target = normalizeUrl(params.get('url') ?? '');
  if (!target) return fail('INVALID_URL', 'Provide a public http(s) URL');
  const strategy = parseStrategy(params.get('strategy'));

  const upstream = new URL(PSI_ENDPOINT);
  upstream.searchParams.set('url', target);
  upstream.searchParams.set('strategy', strategy);
  for (const category of CATEGORIES) upstream.searchParams.append('category', category);
  const locale = params.get('locale');
  if (locale && LOCALES.has(locale)) upstream.searchParams.set('locale', locale);
  if (apiKey) upstream.searchParams.set('key', apiKey);

  let response: Response;
  try {
    response = await fetchImpl(upstream, { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'TimeoutError';
    return timedOut
      ? fail('TIMEOUT', 'PageSpeed took too long to respond')
      : fail('UPSTREAM', 'Could not reach PageSpeed');
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as PsiErrorBody;
    const code = classifyUpstream(response.status, body);
    return fail(code, body.error?.message ?? `PageSpeed responded ${response.status}`);
  }

  const data = (await response.json()) as PsiResponse;
  const runtimeError = data.lighthouseResult?.runtimeError?.code;
  if (runtimeError && UNREACHABLE_MARKERS.includes(runtimeError)) {
    return fail('UNREACHABLE', data.lighthouseResult?.runtimeError?.message ?? runtimeError);
  }

  try {
    const report = normalizeReport(data, target, strategy);
    return json(report, 200, {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
    });
  } catch {
    return fail('UPSTREAM', 'PageSpeed returned an incomplete report');
  }
}

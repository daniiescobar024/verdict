import { queryOptions } from '@tanstack/react-query';
import type { ApiErrorBody, ApiErrorCode, AuditReport, Strategy } from '../model/types';
import type { Locale } from '../../../shared/i18n/context';

export type AuditErrorCode = ApiErrorCode | 'NETWORK';

export class AuditError extends Error {
  override name = 'AuditError';
  constructor(
    readonly code: AuditErrorCode,
    message: string,
  ) {
    super(message);
  }
}

const API_BASE: string = import.meta.env.VITE_API_BASE || '/api/audit';

function isApiError(body: unknown): body is ApiErrorBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'error' in body &&
    typeof (body as ApiErrorBody).error?.code === 'string'
  );
}

export async function fetchAudit(
  url: string,
  strategy: Strategy,
  signal?: AbortSignal,
  { fresh = false, locale = 'en' }: { fresh?: boolean; locale?: Locale } = {},
): Promise<AuditReport> {
  const query = new URLSearchParams({ url, strategy, locale });
  // A unique query string bypasses the CDN cache when the user explicitly re-runs.
  if (fresh) query.set('t', Date.now().toString(36));
  let response: Response;
  try {
    response = await fetch(`${API_BASE}?${query.toString()}`, { signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new AuditError('NETWORK', 'Network request failed');
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok || body === null) {
    if (isApiError(body)) throw new AuditError(body.error.code, body.error.message);
    throw new AuditError('UPSTREAM', `Unexpected response (${response.status})`);
  }
  return body as AuditReport;
}

/** Only transient failures are worth a retry; bad URLs and quota errors are not. */
const isRetryable = (error: unknown) =>
  error instanceof AuditError && (error.code === 'NETWORK' || error.code === 'UPSTREAM');

export const auditQuery = (url: string, strategy: Strategy, locale: Locale) =>
  queryOptions({
    queryKey: ['audit', strategy, locale, url] as const,
    queryFn: ({ signal }) => fetchAudit(url, strategy, signal, { locale }),
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
    retry: (failureCount, error) => failureCount < 1 && isRetryable(error),
  });

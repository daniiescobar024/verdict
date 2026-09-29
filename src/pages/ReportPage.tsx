import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuditError, auditQuery, fetchAudit } from '../features/audit/api/client';
import { ErrorState } from '../features/audit/components/ErrorState';
import { LoadingState } from '../features/audit/components/LoadingState';
import { ReportView } from '../features/audit/components/ReportView';
import { useAuditHistory } from '../features/audit/hooks/useAuditHistory';
import { displayUrl, normalizeUrl, parseStrategy } from '../features/audit/model/params';
import type { Strategy } from '../features/audit/model/types';

function Report({ url, strategy }: { url: string; strategy: Strategy }) {
  const queryClient = useQueryClient();
  const query = useQuery(auditQuery(url, strategy));
  const { record } = useAuditHistory();
  const [refresh, setRefresh] = useState<{ pending: boolean; error: unknown }>({
    pending: false,
    error: null,
  });

  useEffect(() => {
    if (query.data) record(query.data);
  }, [query.data, record]);

  async function rerun() {
    setRefresh({ pending: true, error: null });
    try {
      const report = await fetchAudit(url, strategy, undefined, { fresh: true });
      queryClient.setQueryData(auditQuery(url, strategy).queryKey, report);
      setRefresh({ pending: false, error: null });
    } catch (error) {
      setRefresh({ pending: false, error });
    }
  }

  const title = <title>{`${displayUrl(url)} · Verdict`}</title>;

  if (query.isPending || refresh.pending) {
    return (
      <>
        {title}
        <LoadingState url={url} strategy={strategy} />
      </>
    );
  }
  if (query.isError || refresh.error) {
    return (
      <>
        {title}
        <ErrorState
          error={refresh.error ?? query.error}
          onRetry={() => (refresh.error ? void rerun() : void query.refetch())}
        />
      </>
    );
  }
  return (
    <>
      {title}
      <ReportView report={query.data} onRerun={() => void rerun()} isRefreshing={refresh.pending} />
    </>
  );
}

export default function ReportPage() {
  const [params] = useSearchParams();
  const url = normalizeUrl(params.get('url') ?? '');
  const strategy = parseStrategy(params.get('strategy'));

  if (!url) {
    return (
      <ErrorState error={new AuditError('INVALID_URL', 'Missing url')} onRetry={() => undefined} />
    );
  }
  // Keying by URL resets local state (e.g. a failed re-run) when navigating between reports.
  return <Report key={`${strategy}:${url}`} url={url} strategy={strategy} />;
}

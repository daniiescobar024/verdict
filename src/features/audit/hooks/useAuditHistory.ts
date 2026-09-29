import { useCallback, useSyncExternalStore } from 'react';
import { readStorage, writeStorage } from '../../../shared/lib/storage';
import type { AuditReport, Strategy } from '../model/types';

export interface HistoryEntry {
  url: string;
  strategy: Strategy;
  performance: number | null;
  at: string;
}

const KEY = 'verdict:history';
const LIMIT = 6;
const listeners = new Set<() => void>();
let snapshot: HistoryEntry[] | null = null;

function getSnapshot(): HistoryEntry[] {
  snapshot ??= readStorage<HistoryEntry[]>(KEY, []);
  return snapshot;
}

function emit(next: HistoryEntry[]) {
  snapshot = next;
  writeStorage(KEY, next);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep several open tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    snapshot = null;
    listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

const EMPTY: HistoryEntry[] = [];

export function useAuditHistory() {
  const entries = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  const record = useCallback((report: AuditReport) => {
    const entry: HistoryEntry = {
      url: report.requestedUrl,
      strategy: report.strategy,
      performance: report.scores.performance,
      at: report.fetchedAt,
    };
    const rest = getSnapshot().filter(
      (item) => !(item.url === entry.url && item.strategy === entry.strategy),
    );
    emit([entry, ...rest].slice(0, LIMIT));
  }, []);

  const clear = useCallback(() => emit([]), []);

  return { entries, record, clear };
}

/** Test-only escape hatch: resets the module cache between test cases. */
export function __resetHistoryCache() {
  snapshot = null;
}

import { CATEGORY_ORDER } from './thresholds';
import type { AuditReport, CategoryKey, LabMetricId } from './types';

export type Side = 'a' | 'b';
export type Leader = Side | 'tie' | null;

export type CompareRow =
  | { kind: 'score'; id: CategoryKey; a: number | null; b: number | null; leader: Leader }
  | { kind: 'metric'; id: LabMetricId; a: number | null; b: number | null; leader: Leader };

const METRIC_ORDER: readonly LabMetricId[] = ['lcp', 'fcp', 'tbt', 'cls', 'si'];
/** Lab runs vary a few percent between identical loads; smaller gaps are noise, not a win. */
const METRIC_TOLERANCE = 0.05;

function pickLeader(a: number | null, b: number | null, higherIsBetter: boolean): Leader {
  if (a === null || b === null) return null;
  const tolerance = higherIsBetter ? 0 : Math.max(a, b) * METRIC_TOLERANCE;
  if (Math.abs(a - b) <= tolerance) return 'tie';
  return a > b === higherIsBetter ? 'a' : 'b';
}

export function compareReports(a: AuditReport, b: AuditReport) {
  const metric = (report: AuditReport, id: LabMetricId) =>
    report.lab.find((m) => m.id === id)?.value ?? null;

  const rows: CompareRow[] = [
    ...CATEGORY_ORDER.map((id): CompareRow => ({
      kind: 'score',
      id,
      a: a.scores[id],
      b: b.scores[id],
      leader: pickLeader(a.scores[id], b.scores[id], true),
    })),
    ...METRIC_ORDER.map((id): CompareRow => {
      const valueA = metric(a, id);
      const valueB = metric(b, id);
      return {
        kind: 'metric',
        id,
        a: valueA,
        b: valueB,
        leader: pickLeader(valueA, valueB, false),
      };
    }),
  ];

  const decided = rows.filter((row) => row.leader !== null);
  return {
    rows,
    wins: {
      a: rows.filter((row) => row.leader === 'a').length,
      b: rows.filter((row) => row.leader === 'b').length,
    },
    total: decided.length,
  };
}

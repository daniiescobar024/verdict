import { rateScore } from './thresholds';
import type { AuditReport, Rating } from './types';

export type VerdictTone = Rating | 'unknown';

/**
 * The headline verdict. Real-user data wins when Google has it (that is what
 * visitors actually experience); otherwise the lab performance score decides.
 */
export function getVerdictTone(report: Pick<AuditReport, 'scores' | 'field'>): VerdictTone {
  if (report.field?.overall && !report.field.isOriginFallback) return report.field.overall;
  const score = report.scores.performance;
  return score === null ? 'unknown' : rateScore(score);
}

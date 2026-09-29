import { handleAudit } from '../server/handle-audit';

/** Lighthouse runs on Google's side and routinely takes 20–40 seconds. */
export const maxDuration = 60;

export function GET(request: Request): Promise<Response> {
  return handleAudit(request, process.env.PSI_API_KEY);
}

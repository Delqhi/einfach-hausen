// Post-job review eligibility (EH T-0110). A homeowner may leave at most one
// review for a job only when the contract is truly completed and a provider
// performed the work — never for jobs they own the contract of, and never
// before completion. Pure: reused by server actions and regression suites.
export type EligibilityOutcome = { allowed: boolean; reason: string };

export const REVIEW_ELIGIBLE_REASONS: Record<string, string> = {
  ok: 'Eigentümer kann für erledigten Auftrag bewerten',
  not_homeowner: 'Nur der Eigentümer kann bewerten',
  not_completed: 'Nur erledigte Aufträge können bewertet werden',
  no_provider: 'Auftrag ohne zugewiesenem Handwerker',
  self_review: 'Eigentümer darf sich nicht selbst bewerten',
};

// Resolve the owning homeowner and the provider for a completed job.
export function resolveReviewContext(
  db: { prepare(sql: string): { get(...p: unknown[]): { homeowner_id?: number; provider_id?: number; status?: string } | undefined } },
  jobId: number,
  role: 'homeowner' | 'provider' | null,
  userId: number,
): EligibilityOutcome {
  if (role !== 'homeowner') return { allowed: false, reason: REVIEW_ELIGIBLE_REASONS.not_homeowner };
  const row = db
    .prepare('SELECT j.homeowner_id, q.provider_id, j.status FROM jobs j LEFT JOIN quotes q ON q.id = j.accepted_quote_id WHERE j.id = ?')
    .get(jobId) as { homeowner_id?: number; provider_id?: number; status?: string } | undefined;
  if (!row) return { allowed: false, reason: 'unknown_job' };
  if (row.status !== 'completed') return { allowed: false, reason: REVIEW_ELIGIBLE_REASONS.not_completed };
  if (!row.provider_id) return { allowed: false, reason: REVIEW_ELIGIBLE_REASONS.no_provider };
  if (row.homeowner_id === row.provider_id || row.homeowner_id !== userId) return { allowed: false, reason: REVIEW_ELIGIBLE_REASONS.self_review };
  return { allowed: true, reason: REVIEW_ELIGIBLE_REASONS.ok };
}

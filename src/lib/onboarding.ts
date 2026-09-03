// Homeowner onboarding state machine (EH T-0103).
// Pure functions only: importable from server actions, pages and regression
// scripts alike. The step column stores 'done' for completed onboarding.

export const ONBOARDING_STEPS = ['profile', 'interests', 'contact'] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export type OnboardingState = OnboardingStep | 'done';

export function isOnboardingStep(value: unknown): value is OnboardingStep {
  return typeof value === 'string' && (ONBOARDING_STEPS as readonly string[]).includes(value);
}

export function normalizeOnboardingState(value: unknown): OnboardingState {
  return isOnboardingStep(value) ? value : 'done';
}

export function nextOnboardingStep(current: OnboardingState): OnboardingState | null {
  if (!isOnboardingStep(current)) return null;
  const index = ONBOARDING_STEPS.indexOf(current);
  const next = ONBOARDING_STEPS[index + 1];
  return next ?? 'done';
}

export function stepIndex(current: OnboardingState): number {
  return isOnboardingStep(current) ? ONBOARDING_STEPS.indexOf(current) + 1 : ONBOARDING_STEPS.length;
}

export const ONBOARDING_TOTAL_STEPS = ONBOARDING_STEPS.length;

// Guardrail core: a save action for `action` may advance the machine only when
// the user currently sits exactly on that step. Replays of already-passed
// steps keep their data but never move the pointer backwards or skip ahead.
export type TransitionDecision =
  | { kind: 'advance'; to: OnboardingState }
  | { kind: 'keep' }
  | { kind: 'invalid' };

export function decideOnboardingTransition(current: unknown, action: OnboardingStep): TransitionDecision {
  const state = normalizeOnboardingState(current);
  if (!isOnboardingStep(action)) return { kind: 'invalid' };
  if (state === action) return { kind: 'advance', to: nextOnboardingStep(state)! };
  if (!isOnboardingStep(state)) return { kind: 'invalid' };
  // Replay of an earlier step: persist data, stay put.
  if (ONBOARDING_STEPS.indexOf(action) < ONBOARDING_STEPS.indexOf(state)) return { kind: 'keep' };
  // Action ahead of the current step: refuse out-of-order progression.
  return { kind: 'invalid' };
}

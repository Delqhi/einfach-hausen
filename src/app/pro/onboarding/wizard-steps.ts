// Shared wizard step model (T-0206 B4). Kept out of the "use server" file
// because server-action modules may only export async functions.
export const WIZARD_STEPS = ['firmendaten', 'leistungen', 'arbeitsgebiet', 'abschluss'] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];
export const STEP_LABELS: Record<string, string> = {
  firmendaten: 'Firmendaten',
  leistungen: 'Leistungen',
  arbeitsgebiet: 'Arbeitsgebiet',
  abschluss: 'Abschluss',
};

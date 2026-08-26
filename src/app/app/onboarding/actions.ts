'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { decideOnboardingTransition, normalizeOnboardingState, ONBOARDING_TOTAL_STEPS, ONBOARDING_STEPS, stepIndex } from '@/lib/onboarding';

const CHANNELS = new Set(['email', 'phone', 'whatsapp']);

function text(fd: FormData, key: string) {
  return String(fd.get(key) ?? '').trim();
}

// Server-side guardrail: resolve the caller's current machine state. Done
// users are sent to the dashboard; unknown values collapse to the start.
function requireActiveStep(user_id: number) {
  const row = db.prepare('SELECT onboarding_step FROM homeowner_profiles WHERE user_id=?').get(user_id) as { onboarding_step: string } | undefined;
  const state = normalizeOnboardingState(row?.onboarding_step);
  if (state === 'done') redirect('/app');
  return state;
}

// Apply the transition decision; invalid order never mutates and bounces the
// user back to their actual current step instead.
function applyTransition(user_id: number, current: ReturnType<typeof normalizeOnboardingState>, action: Parameters<typeof decideOnboardingTransition>[1]) {
  const decision = decideOnboardingTransition(current, action);
  if (decision.kind === 'invalid') redirect(`/app/onboarding?error=Aus%20dem%20Ablauf%20gebracht.%20Bitte%20weiter%20bei%20Schritt%20${stepIndex(current)}`);
  if (decision.kind === 'advance') {
    db.prepare('UPDATE homeowner_profiles SET onboarding_step=? WHERE user_id=?').run(decision.to, user_id);
  }
}

export async function loadOnboardingState() {
  const user = await requireUser('homeowner');
  const row = db.prepare('SELECT onboarding_step,address,postcode,interests,preferred_channel FROM homeowner_profiles WHERE user_id=?').get(user.id) as any;
  const rawStep = String(row?.onboarding_step ?? 'done');
  if (rawStep === 'done') redirect('/app');
  const step = (ONBOARDING_STEPS as readonly string[]).includes(rawStep) ? rawStep : 'profile';
  return {
    step,
    stepIndex: stepIndex(normalizeOnboardingState(step)),
    totalSteps: ONBOARDING_TOTAL_STEPS,
    address: String(row?.address ?? ''),
    postcode: String(row?.postcode ?? ''),
    interests: String(row?.interests ?? '').split(',').filter(Boolean),
    preferredChannel: String(row?.preferred_channel ?? ''),
  };
}

export async function saveOnboardingProfileAction(fd: FormData) {
  const user = await requireUser('homeowner');
  const current = requireActiveStep(user.id);
  const address = text(fd, 'address').slice(0, 200);
  const postcode = text(fd, 'postcode').slice(0, 10);
  if (!address || !/^[0-9]{4,5}$/.test(postcode)) redirect('/app/onboarding?error=Bitte%20Stra%C3%9Fe%20und%20g%C3%BCltige%20PLZ%20angeben');
  db.prepare('UPDATE homeowner_profiles SET address=?,postcode=? WHERE user_id=?').run(address, postcode, user.id);
  applyTransition(user.id, current, 'profile');
  revalidatePath('/app/onboarding');
  redirect('/app/onboarding');
}

export async function saveOnboardingInterestsAction(fd: FormData) {
  const user = await requireUser('homeowner');
  const current = requireActiveStep(user.id);
  if (text(fd, 'skip')) {
    applyTransition(user.id, current, 'interests');
    revalidatePath('/app/onboarding');
    redirect('/app/onboarding');
  }
  const valid = new Set((db.prepare('SELECT DISTINCT category FROM service_catalog WHERE active=1').all() as Array<{ category: string }>).map(r => r.category));
  const chosen = [...new Set(fd.getAll('interest').map(String))].filter(c => valid.has(c)).slice(0, 12);
  db.prepare('UPDATE homeowner_profiles SET interests=? WHERE user_id=?').run(chosen.join(','), user.id);
  applyTransition(user.id, current, 'interests');
  revalidatePath('/app/onboarding');
  redirect('/app/onboarding');
}

export async function saveOnboardingContactAction(fd: FormData) {
  const user = await requireUser('homeowner');
  const current = requireActiveStep(user.id);
  const channel = text(fd, 'preferredChannel');
  if (!text(fd, 'skip')) {
    if (!CHANNELS.has(channel)) redirect('/app/onboarding?error=Bitte%20einen%20Kanal%20w%C3%A4hlen');
    db.prepare('UPDATE homeowner_profiles SET preferred_channel=? WHERE user_id=?').run(channel, user.id);
  }
  applyTransition(user.id, current, 'contact');
  revalidatePath('/app');
  redirect('/app?onboarding=done');
}

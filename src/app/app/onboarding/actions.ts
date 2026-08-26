'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';

const CHANNELS = new Set(['email', 'phone', 'whatsapp']);
const STEP_ORDER = ['profile', 'interests', 'contact'] as const;

function text(fd: FormData, key: string) {
  return String(fd.get(key) ?? '').trim();
}

export async function loadOnboardingState() {
  const user = await requireUser('homeowner');
  const row = db.prepare('SELECT onboarding_step,address,postcode,interests,preferred_channel FROM homeowner_profiles WHERE user_id=?').get(user.id) as any;
  const rawStep = String(row?.onboarding_step ?? 'done');
  if (rawStep === 'done') redirect('/app');
  const step = (STEP_ORDER as readonly string[]).includes(rawStep) ? rawStep : 'profile';
  return {
    step,
    stepIndex: STEP_ORDER.indexOf(step as typeof STEP_ORDER[number]) + 1,
    totalSteps: STEP_ORDER.length,
    address: String(row?.address ?? ''),
    postcode: String(row?.postcode ?? ''),
    interests: String(row?.interests ?? '').split(',').filter(Boolean),
    preferredChannel: String(row?.preferred_channel ?? ''),
  };
}

export async function saveOnboardingProfileAction(fd: FormData) {
  const user = await requireUser('homeowner');
  const address = text(fd, 'address').slice(0, 200);
  const postcode = text(fd, 'postcode').slice(0, 10);
  if (!address || !/^[0-9]{4,5}$/.test(postcode)) redirect('/app/onboarding?error=Bitte%20Stra%C3%9Fe%20und%20g%C3%BCltige%20PLZ%20angeben');
  db.prepare("UPDATE homeowner_profiles SET address=?,postcode=?,onboarding_step='interests' WHERE user_id=?").run(address, postcode, user.id);
  revalidatePath('/app/onboarding');
  redirect('/app/onboarding');
}

export async function saveOnboardingInterestsAction(fd: FormData) {
  const user = await requireUser('homeowner');
  if (text(fd, 'skip')) {
    db.prepare("UPDATE homeowner_profiles SET onboarding_step='contact' WHERE user_id=?").run(user.id);
    revalidatePath('/app/onboarding');
    redirect('/app/onboarding');
  }
  const valid = new Set((db.prepare('SELECT DISTINCT category FROM service_catalog WHERE active=1').all() as Array<{ category: string }>).map(r => r.category));
  const chosen = [...new Set(fd.getAll('interest').map(String))].filter(c => valid.has(c)).slice(0, 12);
  db.prepare("UPDATE homeowner_profiles SET interests=?,onboarding_step='contact' WHERE user_id=?").run(chosen.join(','), user.id);
  revalidatePath('/app/onboarding');
  redirect('/app/onboarding');
}

export async function saveOnboardingContactAction(fd: FormData) {
  const user = await requireUser('homeowner');
  const channel = text(fd, 'preferredChannel');
  if (!text(fd, 'skip')) {
    if (!CHANNELS.has(channel)) redirect('/app/onboarding?error=Bitte%20einen%20Kanal%20w%C3%A4hlen');
    db.prepare("UPDATE homeowner_profiles SET preferred_channel=?,onboarding_step='done' WHERE user_id=?").run(channel, user.id);
  } else {
    db.prepare("UPDATE homeowner_profiles SET onboarding_step='done' WHERE user_id=?").run(user.id);
  }
  revalidatePath('/app');
  redirect('/app?onboarding=done');
}

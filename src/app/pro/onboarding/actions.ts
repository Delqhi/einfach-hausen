'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { getProviderContext } from '@/lib/provider';
import { logSecurityEvent } from '@/lib/security/audit';
import { WIZARD_STEPS, type WizardStep } from './wizard-steps';

function text(fd: FormData, name: string, max = 200): string {
  return String(fd.get(name) ?? '').trim().slice(0, max);
}

// Save one wizard stage (additive-only updates; verification flow untouched).
export async function saveWizardStepAction(fd: FormData) {
  const user = await requireUser('provider');
  const ctx = getProviderContext(user.id);
  if (!ctx || !ctx.isOwner) redirect('/pro?error=Nur%20der%20Firmeninhaber%20kann%20den%20Wizard%20ausf%C3%BChren');

  const step = text(fd, 'step', 40) as WizardStep;
  if (!WIZARD_STEPS.includes(step)) redirect('/pro/onboarding?error=Unbekannter%20Schritt');

  const tx = db.transaction(() => {
    if (step === 'firmendaten') {
      db.prepare(`UPDATE provider_profiles SET business_name=COALESCE(NULLIF(?,''),business_name),legal_form=?,founded_year=?,employees=?,website=?,street_address=?,description=?,master_company=?,updated_at=CURRENT_TIMESTAMP WHERE user_id=?`)
        .run(
          text(fd, 'businessName', 120),
          text(fd, 'legalForm', 60),
          (() => { const year = Number(text(fd, 'foundedYear', 8)); return Number.isInteger(year) && year >= 1800 && year <= 2100 ? year : null; })(),
          text(fd, 'employees', 30),
          text(fd, 'website', 160),
          text(fd, 'streetAddress', 160),
          text(fd, 'description', 2000),
          fd.get('masterCompany') ? 1 : 0,
          ctx.providerId,
        );
    }
    if (step === 'leistungen') {
      const catalog = new Set((db.prepare(`SELECT slug FROM service_catalog WHERE active=1`).all() as Array<{ slug: string }>).map((row) => row.slug));
      const selected = fd.getAll('serviceSlug').map(String).filter((slug) => catalog.has(slug));
      const clear = db.prepare(`UPDATE provider_service_offerings SET active=0 WHERE provider_id=?`);
      const upsert = db.prepare(`INSERT INTO provider_service_offerings(provider_id,service_slug,active) VALUES(?,?,1) ON CONFLICT(provider_id,service_slug) DO UPDATE SET active=1,updated_at=CURRENT_TIMESTAMP`);
      clear.run(ctx.providerId);
      for (const slug of selected) upsert.run(ctx.providerId, slug);
      const other = text(fd, 'otherServices', 400);
      if (other) db.prepare(`UPDATE provider_profiles SET description=COALESCE(NULLIF(description,''),?) WHERE user_id=?`).run(`Weitere Leistungen: ${other}`, ctx.providerId);
    }
    if (step === 'arbeitsgebiet') {
      const radius = (() => { const value = Number(text(fd, 'radius', 4)); return Number.isInteger(value) && value >= 1 && value <= 200 ? value : null; })();
      db.prepare(`UPDATE provider_profiles SET radius_km=COALESCE(?,radius_km),postcode=COALESCE(NULLIF(?,''),postcode),updated_at=CURRENT_TIMESTAMP WHERE user_id=?`)
        .run(radius, text(fd, 'postcode', 10), ctx.providerId);
    }
    db.prepare(`UPDATE provider_profiles SET wizard_step=? WHERE user_id=?`).run(step, ctx.providerId);
  });
  tx();
  logSecurityEvent('auth_register', `provider:${ctx.providerId}`, `wizard_step=${step}`);

  if (step === 'abschluss') {
    db.prepare(`UPDATE provider_profiles SET wizard_step='' WHERE user_id=?`).run(ctx.providerId);
    revalidatePath('/pro/profile');
    redirect(`/pro/profile?wizard=done`);
  }
  const nextIndex = WIZARD_STEPS.indexOf(step) + 1;
  revalidatePath('/pro/onboarding');
  redirect(`/pro/onboarding?step=${WIZARD_STEPS[nextIndex] ?? 'abschluss'}`);
}

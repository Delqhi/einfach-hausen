import Link from 'next/link';
import { ArrowRight, Building2, CalendarDays, CheckCircle2, MapPin, Phone, ShieldCheck, Globe } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getProviderContext } from '@/lib/provider';
import { saveWizardStepAction } from './actions';
import { WIZARD_STEPS, STEP_LABELS } from './wizard-steps';

// T-0206 B4: 4-step provider onboarding wizard, Notion reference
// firmendaten_und_leistungen_handwerker.png. Server-rendered per step.


export default async function ProviderOnboardingWizard({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const user = await requireUser('provider');
  const ctx = getProviderContext(user.id);
  if (!ctx || !ctx.isOwner) {
    return (
      <AppShell role="provider" active="/pro" title="Einrichtung">
        <p className="pdx-empty-line">Der Wizard ist für den Firmeninhaber. Ansprechpartner erhalten ihre Aufgaben direkt zugewiesen.</p>
      </AppShell>
    );
  }
  const sp = await searchParams;
  const stepParam = (sp.step || 'firmendaten') as typeof WIZARD_STEPS[number];
  const step = WIZARD_STEPS.includes(stepParam) ? stepParam : 'firmendaten';
  const stepIndex = WIZARD_STEPS.indexOf(step);
  const p = db.prepare(`SELECT * FROM provider_profiles WHERE user_id=?`).get(ctx.providerId) as any;
  const selectedServices = new Set(
    (db.prepare(`SELECT service_slug FROM provider_service_offerings WHERE provider_id=? AND active=1`).all(ctx.providerId) as Array<{ service_slug: string }>).map((row) => row.service_slug),
  );
  const catalog = db.prepare(`SELECT slug,title,category FROM service_catalog WHERE active=1 ORDER BY category,title`).all() as Array<{ slug: string; title: string; category: string }>;
  const byCategory = new Map<string, Array<{ slug: string; title: string }>>();
  for (const entry of catalog) {
    const list = byCategory.get(entry.category) ?? [];
    list.push(entry);
    byCategory.set(entry.category, list);
  }

  return (
    <AppShell role="provider" active="/pro" title="Einrichtung" subtitle={ctx.businessName}>
      <div className="wz-wrap">
        {/* Stepper */}
        <ol className="wz-stepper" aria-label="Fortschritt">
          {WIZARD_STEPS.map((entry, index) => (
            <li key={entry} className={index === stepIndex ? 'wz-step current' : index < stepIndex ? 'wz-step done' : 'wz-step'}>
              <span className="wz-step-dot">{index + 1}</span>
              <small>{STEP_LABELS[entry]}</small>
            </li>
          ))}
        </ol>

        {step === 'firmendaten' && (
          <>
            <h1 className="wz-title">1. Firmendaten</h1>
            <p className="wz-lead">Erzähle uns etwas über dein Unternehmen.</p>
            <form action={saveWizardStepAction} className="wz-form">
              <input type="hidden" name="step" value="firmendaten" />
              <label className="wz-field"><Building2 size={17} /><span>Firmenname</span><input name="businessName" defaultValue={p?.business_name || ctx.businessName} required maxLength={120} placeholder="Muster & Sohn GmbH" /></label>
              <label className="wz-field"><ShieldCheck size={17} /><span>Rechtsform</span>
                <select name="legalForm" defaultValue={p?.legal_form || 'GmbH'}>
                  {['GmbH', 'GbR', 'Einzelunternehmen', 'UG', 'AG', 'Freiberufler'].map((form) => <option key={form}>{form}</option>)}
                </select>
              </label>
              <div className="wz-two">
                <label className="wz-field"><CalendarDays size={17} /><span>Gründungsjahr</span><input name="foundedYear" type="number" min="1800" max="2100" defaultValue={p?.founded_year || ''} placeholder="2012" /></label>
                <label className="wz-field"><span className="wz-invisible" aria-hidden="true">·</span><span>Mitarbeiterzahl</span>
                  <select name="employees" defaultValue={p?.employees || '8–15'}>
                    {['1–3', '4–7', '8–15', '16–30', '30+'].map((range) => <option key={range}>{range}</option>)}
                  </select>
                </label>
              </div>
              <label className="wz-field"><Phone size={17} /><span>Telefonnummer</span><input name="phoneDisplay" type="tel" placeholder="+49 123 4567890" /></label>
              <label className="wz-field"><Globe size={17} /><span>Webseite (optional)</span><input name="website" defaultValue={p?.website || ''} placeholder="www.muster-sohn.de" /></label>
              <label className="wz-field"><MapPin size={17} /><span>Firmensitz / Adresse</span><input name="streetAddress" defaultValue={p?.street_address || ''} placeholder="Musterstraße 12, 12345 Musterstadt" /></label>
              <label className="wz-field wz-area"><span>Über dein Unternehmen</span>
                <textarea name="description" rows={4} maxLength={500} defaultValue={p?.description || ''} placeholder="Wir sind ein zuverlässiger Meisterbetrieb mit langjähriger Erfahrung. Qualität, saubere Arbeit und Kundenzufriedenheit stehen bei uns an erster Stelle." />
                <small className="wz-char">max. 500 Zeichen</small>
              </label>
              <label className="wz-toggle">
                <input type="checkbox" name="masterCompany" defaultChecked={Boolean(p?.master_company)} />
                <span className="wz-toggle-track" aria-hidden="true" />
                <span className="wz-toggle-copy"><strong>Meisterbetrieb</strong><small>Ist dein Unternehmen ein eingetragener Meisterbetrieb?</small></span>
              </label>
              <button className="wz-submit" type="submit">Weiter: Leistungen auswählen <ArrowRight size={16} /></button>
              <Link className="wz-save-later" href="/pro">Speichern & später fortfahren</Link>
            </form>
          </>
        )}

        {step === 'leistungen' && (
          <>
            <h1 className="wz-title">2. Leistungen</h1>
            <p className="wz-lead">Wähle die Kategorien und Leistungen, die du anbietest.</p>
            <form action={saveWizardStepAction} className="wz-form">
              <input type="hidden" name="step" value="leistungen" />
              <p className="wz-group-label">Kategorien</p>
              <div className="wz-categories">
                {[...byCategory.entries()].map(([category, services]) => {
                  const activeCount = services.filter((service) => selectedServices.has(service.slug)).length;
                  return (
                    <label className={`wz-category${activeCount > 0 ? ' wz-category-active' : ''}`} key={category}>
                      <input type="checkbox" name="serviceSlug" value={services[0].slug} defaultChecked={selectedServices.has(services[0].slug)} />
                      <strong>{category}</strong>
                      <small>{services.length} Leistungen</small>
                      <span className="wz-cat-check" aria-hidden="true" />
                    </label>
                  );
                })}
              </div>
              <p className="wz-group-label">Konkrete Leistungen</p>
              <div className="wz-services">
                {catalog.map((service) => (
                  <label className={`wz-service${selectedServices.has(service.slug) ? ' wz-service-active' : ''}`} key={service.slug}>
                    <input type="checkbox" name="serviceSlug" value={service.slug} defaultChecked={selectedServices.has(service.slug)} />
                    <span className="wz-service-check" aria-hidden="true">✓</span>
                    {service.title}
                  </label>
                ))}
              </div>
              <label className="wz-field wz-plain"><span>Weitere Leistungen (optional)</span><input name="otherServices" placeholder="z. B. Winterdienst, Grünflächenpflege…" /></label>
              <button className="wz-submit" type="submit">Weiter: Arbeitsgebiet festlegen <ArrowRight size={16} /></button>
              <Link className="wz-save-later" href="/pro">Speichern & später fortfahren</Link>
            </form>
          </>
        )}

        {step === 'arbeitsgebiet' && (
          <>
            <h1 className="wz-title">3. Arbeitsgebiet</h1>
            <p className="wz-lead">Wo sollen neue Anfragen entstehen?</p>
            <form action={saveWizardStepAction} className="wz-form">
              <input type="hidden" name="step" value="arbeitsgebiet" />
              <label className="wz-field"><MapPin size={17} /><span>PLZ Zentrum</span><input name="postcode" inputMode="numeric" defaultValue={p?.postcode || ''} required placeholder="46325" /></label>
              <label className="wz-field"><span>Einsatzradius (km)</span>
                <input name="radius" type="number" min="1" max="200" defaultValue={p?.radius_km || 25} />
                <small className="wz-char">Anfragen außerhalb des Radius erhältst du nicht.</small>
              </label>
              <button className="wz-submit" type="submit">Weiter: Abschluss <ArrowRight size={16} /></button>
              <Link className="wz-save-later" href="/pro">Speichern & später fortfahren</Link>
            </form>
          </>
        )}

        {step === 'abschluss' && (
          <>
            <h1 className="wz-title">4. Abschluss</h1>
            <p className="wz-lead">Deine Angaben sind gespeichert. Nächster Schritt: Prüfung.</p>
            <div className="wz-summary">
              <CheckCircle2 size={22} />
              <div>
                <strong>{p?.business_name || ctx.businessName}</strong>
                <small>{p?.legal_form || 'GmbH'}{p?.founded_year ? ` · gegr. ${p.founded_year}` : ''}{p?.employees ? ` · ${p.employees} Mitarbeiter` : ''}</small>
                <small>{p?.street_address}</small>
              </div>
            </div>
            <form action={saveWizardStepAction} className="wz-form">
              <input type="hidden" name="step" value="abschluss" />
              <button className="wz-submit" type="submit">Abschließen & zur Prüfung einreichen <ArrowRight size={16} /></button>
              <Link className="wz-save-later" href="/pro">Zurück zur Übersicht</Link>
            </form>
          </>
        )}
      </div>
    </AppShell>
  );
}

import { requireUser } from '@/lib/auth';
import { AppShell } from '@/components/shell';
import { loadOnboardingState, saveOnboardingContactAction, saveOnboardingInterestsAction, saveOnboardingProfileAction } from './actions';
import { db } from '@/lib/db';

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser('homeowner');
  const state = await loadOnboardingState();
  const { error } = await searchParams;
  const categories = [...new Set((db.prepare('SELECT DISTINCT category FROM service_catalog WHERE active=1 ORDER BY category').all() as Array<{ category: string }>).map(r => r.category))];

  return (
    <AppShell role="homeowner" active="/app" title="Einrichtung" subtitle={`Schritt ${state.stepIndex} von ${state.totalSteps}`}>
      <div className="onboarding-flow">
        <progress value={state.stepIndex} max={state.totalSteps} aria-label={`Fortschritt: Schritt ${state.stepIndex} von ${state.totalSteps}`} />
        {error && <div className="alert error" role="status">{error}</div>}
        {state.step === 'profile' && (
          <section aria-labelledby="ob-profile">
            <h2 id="ob-profile">Dein Zuhause</h2>
            <p>Damit Partner in deiner Region arbeiten können. Hallo, {user.first_name} – das dauert eine Minute.</p>
            <form action={saveOnboardingProfileAction} className="document-form">
              <label>Straße und Hausnummer
                <input name="address" defaultValue={state.address} required maxLength={200} />
              </label>
              <label>PLZ
                <input name="postcode" defaultValue={state.postcode} required inputMode="numeric" pattern="[0-9]{4,5}" />
              </label>
              <button className="btn primary">Weiter</button>
            </form>
          </section>
        )}
        {state.step === 'interests' && (
          <section aria-labelledby="ob-interests">
            <h2 id="ob-interests">Worum geht es bei deinem Haus?</h2>
            <p>Mehrfachauswahl möglich. Du kannst das auch überspringen.</p>
            <form action={saveOnboardingInterestsAction} className="document-form">
              {categories.map(category => (
                <label key={category} className="check-row">
                  <input type="checkbox" name="interest" value={category} defaultChecked={state.interests.includes(category)} />
                  {category}
                </label>
              ))}
              <button className="btn primary">Weiter</button>
              <button name="skip" value="1" className="btn ghost">Überspringen</button>
            </form>
          </section>
        )}
        {state.step === 'contact' && (
          <section aria-labelledby="ob-contact">
            <h2 id="ob-contact">Wie dürfen wir dich erreichen?</h2>
            <p>Nur für Termine und Rückfragen zu deinen Aufträgen. Optional.</p>
            <form action={saveOnboardingContactAction} className="document-form">
              <label>Bevorzugter Kanal
                <select name="preferredChannel" defaultValue={state.preferredChannel || 'email'}>
                  <option value="email">E-Mail</option>
                  <option value="phone">Telefon</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </label>
              <button className="btn primary">Fertig</button>
              <button name="skip" value="1" className="btn ghost">Überspringen</button>
            </form>
          </section>
        )}
      </div>
    </AppShell>
  );
}

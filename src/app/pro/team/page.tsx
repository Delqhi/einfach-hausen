import { CheckCircle2, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { ProviderPageIntro, ProviderSectionHeader, ProviderState } from '@/components/provider/workspace';
import { requireUser } from '@/lib/auth';
import { addProviderMemberAction, updateProviderMemberAction } from '@/app/actions';
import { getProviderContext, getProviderMembers } from '@/lib/provider';

export default async function Team({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const u = await requireUser('provider');
  const ctx = getProviderContext(u.id);
  if (!ctx) return null;
  const sp = await searchParams;
  const members = getProviderMembers(ctx.providerId);

  return (
    <AppShell role="provider" active="/pro/team" title="Team" subtitle={ctx.businessName}>
      <ProviderPageIntro
        eyebrow="Unternehmen"
        title="Menschen statt Rollenmatrix"
        description="Ein Unternehmen. Ein Team. Ein Schalter: Aufträge verwalten AN oder AUS. Jeder Ansprechpartner hat einen eigenen App-Zugang."
      />

      {sp.error && <div className="alert error" role="alert">{sp.error}</div>}
      {sp.member === 'created' && <div className="alert success" role="status"><CheckCircle2 /> Ansprechpartner wurde angelegt und kann sich direkt einloggen.</div>}

      <div className="simple-role-principle">
        <ShieldCheck />
        <div>
          <strong>Aufträge verwalten AN</strong>
          <p>Neue passende Anfragen sehen, Angebote senden und gebuchte Aufträge einem Ansprechpartner zuweisen.</p>
        </div>
        <div>
          <strong>Aufträge verwalten AUS</strong>
          <p>Nur eigene zugewiesene Aufträge sehen, Kunden kontaktieren, Status pflegen, dokumentieren und abrechnen.</p>
        </div>
      </div>

      <ProviderSectionHeader title="Ansprechpartner" description={`${members.length} ${members.length === 1 ? 'Person' : 'Personen'} mit eigenem Zugang.`} />
      <div className="stack">
        {members.map((member) => (
          <form action={updateProviderMemberAction.bind(null, member.user_id)} className="member-card" key={member.user_id}>
            <div className="member-head">
              <div className="contact-avatar">{member.first_name?.[0]}{member.last_name?.[0]}</div>
              <div className="grow">
                <strong>{member.first_name} {member.last_name}{member.user_id === ctx.providerId ? ' · Firmenkonto' : ''}</strong>
                <small>{member.email}{member.phone ? ` · ${member.phone}` : ''}</small>
              </div>
              <span className={`status ${member.active ? 'active' : 'pending'}`}>{member.active ? 'App aktiv' : 'App aus'}</span>
            </div>
            <label>
              Bezeichnung
              <input name="jobTitle" defaultValue={member.job_title || ''} placeholder="z. B. Kundendienst, Techniker, Disposition" disabled={!ctx.canManageJobs} />
            </label>
            <div className="member-switches">
              <label><input type="checkbox" name="canManageJobs" defaultChecked={!!member.can_manage_jobs} disabled={!ctx.canManageJobs} /> Aufträge verwalten {member.can_manage_jobs ? 'AN' : 'AUS'}</label>
              <label><input type="checkbox" name="active" defaultChecked={!!member.active} disabled={!ctx.canManageJobs} /> App-Zugang {member.active ? 'AN' : 'AUS'}</label>
            </div>
            <small className="member-explain">{member.can_manage_jobs ? 'Kann neue Anfragen bearbeiten und Aufträge verteilen.' : 'Sieht nur eigene zugewiesene Arbeit und die dazugehörigen Kunden.'}</small>
            {ctx.canManageJobs && <button className="btn light">Änderungen speichern</button>}
          </form>
        ))}
        {members.length === 0 && (
          <ProviderState
            icon={<Users size={21} />}
            title="Noch kein Ansprechpartner angelegt"
            description="Lege die Menschen an, die Kunden betreuen oder Aufträge ausführen."
          />
        )}
      </div>

      {ctx.canManageJobs && (
        <>
          <ProviderSectionHeader title="Ansprechpartner hinzufügen" description="Ein eigener Zugang, eine klare Auftragsberechtigung." />
          <form action={addProviderMemberAction} className="team-add-form">
            <div className="two">
              <label>Vorname<input name="firstName" required /></label>
              <label>Nachname<input name="lastName" required /></label>
            </div>
            <label>Funktion<input name="jobTitle" placeholder="z. B. Techniker" /></label>
            <label>E-Mail<input name="email" type="email" required /></label>
            <label>Telefon<input name="phone" /></label>
            <label>Startpasswort<input name="password" type="password" minLength={8} required /><small>Der Ansprechpartner kann sich damit direkt in der Partner-App anmelden.</small></label>
            <label className="team-manage-toggle"><input type="checkbox" name="canManageJobs" /> Aufträge verwalten AN</label>
            <button className="btn light wide"><UserPlus size={16} /> Ansprechpartner anlegen</button>
          </form>
        </>
      )}
    </AppShell>
  );
}

import { CheckCircle2, Users } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { ProviderAccessBoundary, ProviderPageIntro, ProviderSectionHeader, ProviderState } from '@/components/provider/workspace';
import { requireUser } from '@/lib/auth';
import { EHPanel, EHErrorState, EHField, EHInput, EHCheckbox } from '@/design-system';
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

      <ProviderAccessBoundary canManageJobs={ctx.canManageJobs} />

      {sp.error && <EHErrorState text={sp.error} />}
      {sp.member === 'created' && <div className="alert success" role="status"><CheckCircle2 /> Ansprechpartner wurde angelegt und kann sich direkt einloggen.</div>}

      <EHPanel title="Aufträge verwalten AN oder AUS">
        <p>Neue passende Anfragen sehen, Angebote senden und gebuchte Aufträge einem Ansprechpartner zuweisen.</p>
        <p>Nur eigene zugewiesene Aufträge sehen, Kunden kontaktieren, Status pflegen, dokumentieren und abrechnen.</p>
      </EHPanel>

      <ProviderSectionHeader title="Ansprechpartner" description={`${members.length} ${members.length === 1 ? 'Person' : 'Personen'} mit eigenem Zugang.`} />
      <div className="stack">
        {members.map((member) => (
          <form action={updateProviderMemberAction.bind(null, member.user_id)} key={member.user_id}>
            <EHPanel title={`${member.first_name} ${member.last_name}${member.user_id === ctx.providerId ? ' · Firmenkonto' : ''}`}>
            <p>{member.email}{member.phone ? ` · ${member.phone}` : ''} — {member.active ? 'App aktiv' : 'App aus'}</p>
            <EHField id={`member-title-${member.user_id}`} label="Bezeichnung"><EHInput id={`member-title-${member.user_id}`} name="jobTitle" defaultValue={member.job_title || ''} placeholder="z. B. Kundendienst, Techniker, Disposition" disabled={!ctx.canManageJobs} /></EHField>
            <EHCheckbox label={`Aufträge verwalten ${member.can_manage_jobs ? 'AN' : 'AUS'}`} name="canManageJobs" defaultChecked={!!member.can_manage_jobs} disabled={!ctx.canManageJobs} />
            <EHCheckbox label={`App-Zugang ${member.active ? 'AN' : 'AUS'}`} name="active" defaultChecked={!!member.active} disabled={!ctx.canManageJobs} />
            <small>{member.can_manage_jobs ? 'Kann neue Anfragen bearbeiten und Aufträge verteilen.' : 'Sieht nur eigene zugewiesene Arbeit und die dazugehörigen Kunden.'}</small>
            {ctx.canManageJobs && <button>Änderungen speichern</button>}
            </EHPanel>
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
          <EHPanel title="Ansprechpartner hinzufügen">
          <p>Ein eigener Zugang, eine klare Auftragsberechtigung.</p>
          <form action={addProviderMemberAction}>
            <EHField id="team-first" label="Vorname"><EHInput id="team-first" name="firstName" required /></EHField>
            <EHField id="team-last" label="Nachname"><EHInput id="team-last" name="lastName" required /></EHField>
            <EHField id="team-job" label="Funktion"><EHInput id="team-job" name="jobTitle" placeholder="z. B. Techniker" /></EHField>
            <EHField id="team-email" label="E-Mail"><EHInput id="team-email" name="email" type="email" required /></EHField>
            <EHField id="team-phone" label="Telefon"><EHInput id="team-phone" name="phone" /></EHField>
            <EHField id="team-pass" label="Startpasswort" hint="Der Ansprechpartner kann sich damit direkt in der Partner-App anmelden."><EHInput id="team-pass" name="password" type="password" minLength={8} required /></EHField>
            <EHCheckbox label="Aufträge verwalten AN" name="canManageJobs" />
            <button>Ansprechpartner anlegen</button>
          </form>
          </EHPanel>
        </>
      )}
    </AppShell>
  );
}

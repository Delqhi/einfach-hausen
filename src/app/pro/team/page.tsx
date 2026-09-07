import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { EHAppHeader, EHPanel, EHField, EHInput, EHCheckbox, EHWorkflowStack, EHWorkflowForm, EHFormSection, EHFieldGrid, EHFormFeedback, EHSubmitButton, EHText, EHEmptyState } from '@/design-system';
import { addProviderMemberAction, updateProviderMemberAction } from '@/app/actions';
import { getProviderContext, getProviderMembers } from '@/lib/provider';

export default async function Team({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const u = await requireUser('provider');
  const ctx = getProviderContext(u.id);
  if (!ctx) return <AppShell role="provider" active="/pro/team" title="Team"><EHEmptyState title="Kein Betrieb zugeordnet" text="Für die Teamverwaltung ist ein zugeordneter Betrieb erforderlich." /></AppShell>;
  const sp = await searchParams;
  const members = getProviderMembers(ctx.providerId);
  return <AppShell role="provider" active="/pro/team" title="Team" subtitle={ctx.businessName}>
    <EHWorkflowStack>
      <EHAppHeader title="Dein Team. Klare Zuständigkeiten." text="Jeder Ansprechpartner hat einen eigenen Zugang. Hier siehst du, wer Aufträge verwaltet und wer zugewiesene Arbeit übernimmt." />
      {!ctx.canManageJobs && <EHFormFeedback kind="info">Du kannst die Teamübersicht ansehen. Änderungen sind Personen mit der Berechtigung „Aufträge verwalten“ vorbehalten.</EHFormFeedback>}
      {sp.error && <EHFormFeedback kind="error">{sp.error}</EHFormFeedback>}
      {sp.member === 'created' && <EHFormFeedback kind="success">Ansprechpartner wurde angelegt und kann sich direkt einloggen.</EHFormFeedback>}
      <EHPanel title="Was die Berechtigung bedeutet"><EHWorkflowStack>
        <EHText>Mit „Aufträge verwalten“: passende Anfragen bearbeiten, Angebote senden und gebuchte Aufträge zuweisen.</EHText>
        <EHText>Ohne diese Berechtigung: eigene zugewiesene Aufträge betreuen, Kunden kontaktieren, Status pflegen, dokumentieren und abrechnen.</EHText>
      </EHWorkflowStack></EHPanel>
      <EHText>{members.length} {members.length === 1 ? 'Person mit eigenem Zugang' : 'Personen mit eigenem Zugang'}.</EHText>
      {members.map(member => {
        const firmAccount = member.user_id === ctx.providerId;
        return <EHWorkflowForm key={member.user_id} action={updateProviderMemberAction.bind(null, member.user_id)}>
          <EHFormSection title={member.first_name + ' ' + member.last_name + (firmAccount ? ' · Firmenkonto' : '')}>
            <EHText>{member.email}{member.phone ? ' · ' + member.phone : ''} — {member.active ? 'App-Zugang aktiv' : 'App-Zugang deaktiviert'}</EHText>
            <EHField id={'member-title-' + member.user_id} label="Bezeichnung">
              <EHInput id={'member-title-' + member.user_id} name="jobTitle" defaultValue={member.job_title || ''} placeholder="z. B. Kundendienst, Techniker, Disposition" disabled={!ctx.canManageJobs} />
            </EHField>
            <EHCheckbox label="Aufträge verwalten" name="canManageJobs" defaultChecked={!!member.can_manage_jobs} disabled={!ctx.canManageJobs || firmAccount} />
            <EHCheckbox label="App-Zugang aktiv" name="active" defaultChecked={!!member.active} disabled={!ctx.canManageJobs || firmAccount} />
            {firmAccount && <EHText>Beim Firmenkonto bleiben Auftragsverwaltung und App-Zugang aktiv.</EHText>}
            {ctx.canManageJobs && <EHSubmitButton>Änderungen speichern</EHSubmitButton>}
          </EHFormSection>
        </EHWorkflowForm>;
      })}
      {members.length === 0 && <EHEmptyState title="Noch kein Ansprechpartner angelegt" text="Hier erscheinen die Menschen, die Kunden betreuen oder Aufträge ausführen." />}
      {ctx.canManageJobs && <EHWorkflowForm action={addProviderMemberAction}>
        <EHFormSection title="Ansprechpartner hinzufügen" description="Ein eigener Zugang mit klarer Auftragsberechtigung.">
          <EHFieldGrid>
            <EHField id="team-first" label="Vorname" required><EHInput id="team-first" name="firstName" autoComplete="given-name" required /></EHField>
            <EHField id="team-last" label="Nachname" required><EHInput id="team-last" name="lastName" autoComplete="family-name" required /></EHField>
            <EHField id="team-job" label="Funktion"><EHInput id="team-job" name="jobTitle" placeholder="z. B. Techniker" /></EHField>
            <EHField id="team-email" label="E-Mail" required><EHInput id="team-email" name="email" type="email" autoComplete="email" required /></EHField>
            <EHField id="team-phone" label="Telefon"><EHInput id="team-phone" name="phone" type="tel" autoComplete="tel" /></EHField>
            <EHField id="team-pass" label="Startpasswort" required hint="Mindestens 8 Zeichen. Damit kann sich der Ansprechpartner direkt anmelden."><EHInput id="team-pass" name="password" type="password" autoComplete="new-password" minLength={8} aria-describedby="team-pass-hint" required /></EHField>
          </EHFieldGrid>
          <EHCheckbox label="Aufträge verwalten" name="canManageJobs" />
          <EHSubmitButton pendingLabel="Zugang wird angelegt …">Ansprechpartner anlegen</EHSubmitButton>
        </EHFormSection>
      </EHWorkflowForm>}
    </EHWorkflowStack>
  </AppShell>;
}

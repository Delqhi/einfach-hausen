import {MessageCircle, ShieldCheck, FileText} from "lucide-react";
import Link from 'next/link';
import { HomeownerHausmeisterComposer } from '@/components/homeowner/homeowner-hausmeister-composer';
import { EHAppHeader, EHList, EHCallout, EHTextLink, EHWorkspaceGrid, EHWorkSection, EHPriorityAction, EHServiceDirectory } from '@/design-system';
import { AppShell } from '@/components/shell';

import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel } from '@/lib/format';
import { primaryProperty } from '@/lib/properties';

export default async function Dashboard() {
  const user = await requireUser('homeowner');
  const profile = db.prepare('SELECT address,postcode,onboarding_step FROM homeowner_profiles WHERE user_id=?').get(user.id) as any;
  const onboardingPending = profile?.onboarding_step && profile.onboarding_step !== 'done';
  const property = primaryProperty(user.id);
  const houseAddress = property?.address || profile?.address || '';
  const housePostcode = property?.postcode || profile?.postcode || '';
  const houseContext = [houseAddress, housePostcode].filter(Boolean).join(', ');

  const nextAppointment = db.prepare(
    `SELECT a.*,j.title,p.business_name FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.homeowner_id=? AND a.status='confirmed' AND datetime(a.start_at) >= datetime('now') ORDER BY datetime(a.start_at) ASC LIMIT 1`
  ).get(user.id) as any;

  const openDecision = db.prepare(
    `SELECT * FROM jobs WHERE homeowner_id=? AND status='quoted' ORDER BY updated_at DESC LIMIT 1`
  ).get(user.id) as any;
  const openDecisionQuotes = openDecision
    ? (db.prepare(`SELECT COUNT(*) c FROM quotes WHERE job_id=? AND status='pending'`).get(openDecision.id) as {c:number}).c
    : 0;

  const dueMaintenance = property
    ? db.prepare(`SELECT * FROM maintenance_tasks WHERE property_id=? AND status='open' ORDER BY date(due_date) ASC LIMIT 1`).get(property.id) as any
    : null;

  const nextSteps = [
    nextAppointment ? 'appointment' : null,
    openDecision ? 'decision' : null,
    dueMaintenance ? 'maintenance' : null,
  ].filter(Boolean) as string[];

  return (
    <AppShell role="homeowner" active="/app" title="Mein Zuhause" subtitle="Dein Haus-Copilot">
      <>
        <EHAppHeader eyebrow="Übersicht" title={`Hallo ${user.first_name}.`} text={houseContext ? `${houseContext}` : 'Dein Zuhause im Überblick.'} />

        {onboardingPending && (
          <EHCallout title="Einrichtung unvollständig">
            <p>Du hast die Ersteinrichtung noch nicht abgeschlossen.</p>
            <EHTextLink href="/app/onboarding">Jetzt weiter einrichten</EHTextLink>
          </EHCallout>
        )}

        <EHWorkspaceGrid main={<>
          {openDecision && <EHPriorityAction eyebrow="Deine Entscheidung" title={openDecision.title} text={openDecisionQuotes > 0 ? `${openDecisionQuotes} Angebote liegen zur Prüfung vor.` : 'Sieh dir den aktuellen Stand deines Vorgangs an.'} href={`/app/jobs/${openDecision.id}`} label="Angebot prüfen"/>}
          <EHWorkSection title="Was steht bei deinem Haus an?" link={{href:"/app/hausmeister",label:"Zum Hausmeister"}}>
            <p>Beschreibe dein Anliegen. Wir helfen dir, den nächsten Schritt zu organisieren.</p>
            <div id="dashboard-composer"><HomeownerHausmeisterComposer starterHint="Was gibt es an deinem Haus zu tun?"/></div>
          </EHWorkSection>
        </>} aside={<EHWorkSection title="Dein nächster Überblick">
        {nextSteps.length === 0 ? (
          <div className="empty compact" role="status">
            <p>Aktuell steht kein Termin an. Plane Wartungen über <Link href="/app/year">Mein Jahr</Link> oder starte oben eine Anfrage.</p>
          </div>
        ) : (
          <EHList label="Als Nächstes" items={[
            ...(nextAppointment ? [{ id: 'appt-' + nextAppointment.job_id, title: 'Nächster Termin', text: `${nextAppointment.title} · ${nextAppointment.business_name} · ${dateLabel(nextAppointment.start_at)}`, href: `/app/jobs/${nextAppointment.job_id}` }] : []),
            // openDecision renders once as EHPriorityAction above; no duplicate list entry.
            ...(dueMaintenance ? [{ id: 'maint', title: 'Fällige Wartung', text: `${dueMaintenance.title} · ${dateLabel(dueMaintenance.due_date)}`, href: '/app/year' }] : []),
          ]} />
        )}
        </EHWorkSection>}/>

        <EHServiceDirectory groups={[{title:"Für dein Zuhause",items:[
          {href:"/app/consultation",title:"Beratung",text:"Vorhaben besprechen und Möglichkeiten klären.",icon:<MessageCircle/>},
          {href:"/app/emergency",title:"Notfall",text:"Hinweise und Unterstützung für dringende Anliegen.",icon:<ShieldCheck/>},
        ]},{title:"Deine Hausakte",items:[{href:"/app/documents",title:"Dokumente",text:"Pläne, Rechnungen und Nachweise wiederfinden.",icon:<FileText/>}]}]}/>
        </>
    </AppShell>
  );
}

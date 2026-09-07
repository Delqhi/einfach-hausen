import { ChevronRight, UserRound } from 'lucide-react';
import { EHAppHeader, EHPanel, EHList, EHCallout, EHField, EHInput } from '@/design-system';
import { AppShell } from '@/components/shell';
import { InstallAppCard } from '@/components/install-app-card';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { logoutAction,saveProfileAction } from '@/app/actions';

export default async function Profile(){
  const u=await requireUser('homeowner'); const p=db.prepare('SELECT * FROM homeowner_profiles WHERE user_id=?').get(u.id) as any;
  const initials=`${u.first_name?.[0]||''}${u.last_name?.[0]||''}`.toUpperCase();
  return <AppShell role="homeowner" active="/app/profile" title="Profil" subtitle="Konto und Einstellungen">
    <EHAppHeader eyebrow="Konto" title={`${u.first_name} ${u.last_name}`} text={u.email} />
    <div className="profile-avatar-large" aria-hidden="true">{initials}</div>

    <EHPanel title="Persönliche Daten">
      <details><summary><span><UserRound/></span><strong>Persönliche Daten</strong><ChevronRight/></summary><form action={saveProfileAction}><EHField id="profile-first" label="Vorname"><EHInput id="profile-first" name="firstName" defaultValue={u.first_name}/></EHField><EHField id="profile-last" label="Nachname"><EHInput id="profile-last" name="lastName" defaultValue={u.last_name}/></EHField><EHField id="profile-phone" label="Mobilnummer" hint="Für direkte Erreichbarkeit; später auch für WhatsApp nach Freischaltung."><EHInput id="profile-phone" name="phone" inputMode="tel" defaultValue={u.phone||''} placeholder="+49 …"/></EHField><EHField id="profile-postcode" label="PLZ"><EHInput id="profile-postcode" name="postcode" defaultValue={p?.postcode||''}/></EHField><EHField id="profile-address" label="Adresse"><EHInput id="profile-address" name="address" defaultValue={p?.address||''}/></EHField><button>Speichern</button></form></details>
    </EHPanel>
    <EHList label="Profilbereiche" items={[
      { id: 'plans', title: 'Zahlungen & Mitgliedschaft', href: '/app/plans' },
      { id: 'notifications', title: 'Benachrichtigungen', href: '/notifications' },
      { id: 'security', title: 'Sicherheit', text: 'Geschützte Sitzung' },
      { id: 'help', title: 'Hilfe & Support', text: 'Direkte Unterstützung' },
      { id: 'settings', title: 'App-Einstellungen', text: 'Installation & Gerät' },
    ]} />

    <InstallAppCard/>
    <EHCallout title="WhatsApp ist noch nicht freigeschaltet"><p>In der App kannst du den Hausmeister bereits nutzen. Der WhatsApp-Kanal wird erst angeboten, sobald der Business-Kanal tatsächlich verfügbar ist.</p></EHCallout>
    <EHCallout title="Deine Hausdaten bleiben privat."><p>Partner sehen nur die Informationen, die für einen konkreten Kontakt oder Auftrag notwendig sind.</p></EHCallout>
    <form action={logoutAction}><button className="btn ghost wide">Ausloggen</button></form>
  </AppShell>;
}

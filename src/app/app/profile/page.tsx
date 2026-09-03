import Link from 'next/link';
import { Bell,ChevronRight,CreditCard,HelpCircle,LockKeyhole,MessageCircle,Settings,ShieldCheck,UserRound } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { InstallAppCard } from '@/components/install-app-card';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { logoutAction,saveProfileAction } from '@/app/actions';

export default async function Profile(){
  const u=await requireUser('homeowner'); const p=db.prepare('SELECT * FROM homeowner_profiles WHERE user_id=?').get(u.id) as any;
  const initials=`${u.first_name?.[0]||''}${u.last_name?.[0]||''}`.toUpperCase();
  return <AppShell role="homeowner" active="/app/profile" title="Profil" subtitle="Konto und Einstellungen">
    <section className="profile-identity"><div className="profile-avatar-large">{initials}</div><div><h1>{u.first_name} {u.last_name}</h1><p>{u.email}</p></div></section>

    <div className="settings-list">
      <details><summary><span><UserRound/></span><strong>Persönliche Daten</strong><ChevronRight/></summary><form action={saveProfileAction} className="profile-form settings-form"><div className="two"><label>Vorname<input name="firstName" defaultValue={u.first_name}/></label><label>Nachname<input name="lastName" defaultValue={u.last_name}/></label></div><label>Mobilnummer<input name="phone" inputMode="tel" defaultValue={u.phone||''} placeholder="+49 …"/><small>Für direkte Erreichbarkeit; später auch für WhatsApp nach Freischaltung.</small></label><label>PLZ<input name="postcode" defaultValue={p?.postcode||''}/></label><label>Adresse<input name="address" defaultValue={p?.address||''}/></label><button className="btn primary">Speichern</button></form></details>
      <Link href="/app/plans"><span><CreditCard/></span><strong>Zahlungen & Mitgliedschaft</strong><ChevronRight/></Link>
      <Link href="/notifications"><span><Bell/></span><strong>Benachrichtigungen</strong><ChevronRight/></Link>
      <div><span><LockKeyhole/></span><strong>Sicherheit</strong><small>Geschützte Sitzung</small></div>
      <div><span><HelpCircle/></span><strong>Hilfe & Support</strong><small>Direkte Unterstützung</small></div>
      <div><span><Settings/></span><strong>App-Einstellungen</strong><small>Installation & Gerät</small></div>
    </div>

    <InstallAppCard/>
    <div className="whatsapp-card" role="note"><MessageCircle aria-hidden="true"/><div><strong>WhatsApp ist noch nicht freigeschaltet</strong><p>In der App kannst du den Hausmeister bereits nutzen. Der WhatsApp-Kanal wird erst angeboten, sobald der Business-Kanal tatsächlich verfügbar ist.</p></div></div>
    <div className="profile-trust"><ShieldCheck/><span><strong>Deine Hausdaten bleiben privat.</strong><small>Partner sehen nur die Informationen, die für einen konkreten Kontakt oder Auftrag notwendig sind.</small></span></div>
    <form action={logoutAction}><button className="btn ghost wide">Ausloggen</button></form>
  </AppShell>;
}

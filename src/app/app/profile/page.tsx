import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { logoutAction,saveProfileAction } from '@/app/actions';

export default async function Profile(){
  const u=await requireUser('homeowner'); const p=db.prepare('SELECT * FROM homeowner_profiles WHERE user_id=?').get(u.id) as any;
  return <AppShell role="homeowner" active="/app/profile"><h1 className="page-title">Profil</h1><form action={saveProfileAction} className="profile-form"><div className="two"><label>Vorname<input name="firstName" defaultValue={u.first_name}/></label><label>Nachname<input name="lastName" defaultValue={u.last_name}/></label></div><label>Mobilnummer für WhatsApp<input name="phone" inputMode="tel" defaultValue={u.phone||''} placeholder="+49 …"/><small>Diese Nummer verknüpft deinen KI-Hausmeister mit dem WhatsApp-Kanal.</small></label><label>PLZ<input name="postcode" defaultValue={p?.postcode||''}/></label><label>Adresse<input name="address" defaultValue={p?.address||''}/></label><button className="btn primary">Speichern</button></form><div className="whatsapp-card"><MessageCircle/><div><strong>Hausmeister auch über WhatsApp</strong><p>Ist die oben gespeicherte Nummer mit dem Einfach-Hausen-WhatsApp-Business-Kanal verbunden, kannst du dieselben Anfragen direkt dort schreiben. Sie laufen in dieselbe Hausmeister-Logik und Hausakte.</p></div></div><SectionTitle>Mein Konto</SectionTitle><div className="profile-links"><Link href="/app/plans">Mitgliedschaft & Pakete</Link><Link href="/app/documents">Dokumente & Belege</Link></div><form action={logoutAction}><button className="btn ghost wide">Ausloggen</button></form></AppShell>;
}

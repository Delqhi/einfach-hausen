import { AlertTriangle,Clock3,MapPin,ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { createEmergencyAction } from '@/app/actions';

export default async function Emergency({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const user=await requireUser('homeowner'); const sp=await searchParams; const profile=db.prepare('SELECT postcode,address FROM homeowner_profiles WHERE user_id=?').get(user.id) as any;
  return <AppShell role="homeowner" active="/app" title="Notfall" subtitle="Schnell verfügbare Hilfe in deiner Nähe">
    <div className="emergency-hero"><AlertTriangle/><div><span>NOTFALL</span><h1>Was ist passiert?</h1><p>Wir suchen zuerst nach passenden verfügbaren Helfern in deiner Nähe – nicht automatisch nach dem teuersten 24/7-Notdienst.</p></div></div>
    {sp.error&&<div className="alert error" role="alert">{sp.error}</div>}
    <div className="emergency-trust"><span><MapPin/> Nähe</span><span><Clock3/> Verfügbarkeit</span><span><ShieldCheck/> Qualifikation & Bewertung</span></div>
    <form action={createEmergencyAction} className="emergency-form"><label>Notfall<select name="emergencyType" required defaultValue=""><option value="" disabled>Bitte auswählen</option><option value="water">Wasserrohrbruch / Wasserschaden</option><option value="heating">Heizung ausgefallen</option><option value="electric">Stromproblem</option><option value="roof">Dach- oder Sturmschaden</option><option value="lock">Tür / Schloss</option><option value="sanitary">Sanitär-Notfall</option><option value="other">Sonstiger Notfall</option></select></label><label>Was ist passiert?<textarea name="description" rows={5} required placeholder="Zum Beispiel: Unter der Spüle läuft stark Wasser aus …"/></label><div className="emergency-location"><small>Hilfe wird gesucht für</small><strong>{profile?.address||profile?.postcode||'dein hinterlegtes Zuhause'}</strong></div><button className="btn emergency-button wide">Jetzt Helfer suchen</button></form>
    <p className="emergency-disclaimer">Bei akuter Gefahr für Leib und Leben, Brand oder Gasgeruch nutze bitte unmittelbar die zuständigen öffentlichen Notrufstellen. Einfach Hausen ersetzt keinen öffentlichen Notruf.</p>
  </AppShell>;
}

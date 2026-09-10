import { Clock3,MapPin,ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { EHAppHeader, EHPanel, EHErrorState, EHField, EHSelect, EHTextarea, EHSubmitButton } from '@/design-system';
import { db } from '@/lib/db';
import { createEmergencyAction } from '@/app/actions';

export default async function Emergency({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const user=await requireUser('homeowner'); const sp=await searchParams; const profile=db.prepare('SELECT postcode,address FROM homeowner_profiles WHERE user_id=?').get(user.id) as any;
  return <AppShell role="homeowner" active="/app" title="Notfall" subtitle="Schnell verfügbare Hilfe in deiner Nähe">
    <EHAppHeader eyebrow="Notfall" title="Was ist passiert?" text="Wir suchen zuerst nach passenden verfügbaren Helfern in deiner Nähe – nicht automatisch nach dem teuersten 24/7-Notdienst." />
    {sp.error&&<EHErrorState text={sp.error} />}
    <div className="alert emergency-112" role="alert">
      <strong>Lebensgefahr, Brand oder Gasgeruch?</strong>
      <span>Sofort <a href="tel:112">112</a> anrufen. Bei Gasgeruch: Fenster öffnen, keine Schalter betätigen, Gebäude verlassen. Einfach Hausen ersetzt keinen öffentlichen Notruf.</span>
    </div>
    <div className="emergency-trust"><span><MapPin/> Nähe</span><span><Clock3/> Verfügbarkeit</span><span><ShieldCheck/> Qualifikation & Bewertung</span></div>
    <EHPanel title="Notfall melden">
    <form action={createEmergencyAction}><EHField id="emg-type" label="Notfall"><EHSelect id="emg-type" name="emergencyType" required defaultValue=""><option value="" disabled>Bitte auswählen</option><option value="water">Wasserrohrbruch / Wasserschaden</option><option value="heating">Heizung ausgefallen</option><option value="electric">Stromproblem</option><option value="roof">Dach- oder Sturmschaden</option><option value="lock">Tür / Schloss</option><option value="sanitary">Sanitär-Notfall</option><option value="other">Sonstiger Notfall</option></EHSelect></EHField><EHField id="emg-desc" label="Was ist passiert?"><EHTextarea id="emg-desc" name="description" rows={5} required placeholder="Zum Beispiel: Unter der Spüle läuft stark Wasser aus …"/></EHField><p>Hilfe wird gesucht für <strong>{profile?.address||profile?.postcode||'dein hinterlegtes Zuhause'}</strong></p><EHSubmitButton>Jetzt Helfer suchen</EHSubmitButton></form>
    </EHPanel>
  </AppShell>;
}

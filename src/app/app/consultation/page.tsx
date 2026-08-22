import { Camera,MessageCircle,ShieldCheck,UserRound } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { createConsultationAction } from '@/app/actions';
import { requireUser } from '@/lib/auth';

export default async function Consultation({searchParams}:{searchParams:Promise<Record<string,string>>}){
  await requireUser('homeowner'); const sp=await searchParams;
  return <AppShell role="homeowner" active="/app" title="Beratung" subtitle="Erst einen Fachmann fragen – ohne Auftrag">
    <div className="consultation-hero"><MessageCircle/><div><span>BERATUNG</span><h1>Frag erst einen Fachmann.</h1><p>Du kannst dein Problem schildern und einen passenden Ansprechpartner finden. Daraus entsteht noch kein Auftrag und kein Preis.</p></div></div>
    {sp.error&&<div className="alert error">{sp.error}</div>}
    <div className="consultation-points"><span><UserRound/><b>Konkreter Ansprechpartner</b><small>Du weißt, mit wem du sprichst.</small></span><span><ShieldCheck/><b>Geprüfter Partner</b><small>Passend zu deinem Thema und deiner Region.</small></span><span><Camera/><b>Foto oder Video</b><small>Hilft bei einer ersten Einschätzung.</small></span></div>
    <form action={createConsultationAction} className="consultation-form"><label>Wobei brauchst du Rat?<textarea name="description" rows={6} required placeholder="Zum Beispiel: Mein Dach ist an einer Stelle feucht. Was könnte die Ursache sein?"/></label><label>Foto oder Video <small>(optional)</small><input type="file" name="photo" accept="image/*,video/mp4,video/webm,video/quicktime,video/x-m4v"/></label><button className="btn primary wide">Ansprechpartner finden</button></form>
  </AppShell>;
}

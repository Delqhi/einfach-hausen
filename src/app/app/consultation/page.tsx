import Link from 'next/link';
import { Camera, MessageCircle, ShieldCheck, UserRound } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { HausmeisterAssistant } from '@/components/homeowner/hausmeister-assistant';
import { createConsultationAction } from '@/app/actions';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function Consultation({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const user = await requireUser('homeowner');
  const sp = await searchParams;
  const successId = Number(sp.success);
  const created = Number.isSafeInteger(successId) && successId > 0
    ? db.prepare(`SELECT id FROM jobs WHERE id=? AND homeowner_id=? AND request_kind='contact'`).get(successId, user.id) as { id: number } | undefined
    : undefined;

  return <AppShell role="homeowner" active="/app" title="Beratung" subtitle="Erst einen Fachmann fragen – ohne Auftrag">
    <div className="consultation-hero"><MessageCircle/><div><span>BERATUNG</span><h1>Frag erst einen Fachmann.</h1><p>Du kannst dein Problem schildern und einen passenden Ansprechpartner finden. Daraus entsteht noch kein Auftrag und kein Preis.</p></div></div>
    {sp.error && <div className="alert error" role="alert">{sp.error}</div>}
    {created && <div className="alert success" role="status" aria-live="polite">Kontaktanfrage angelegt. Es wurde kein Auftrag und kein Preis erstellt. <Link href={`/app/jobs/${created.id}`}>Anfrage ansehen</Link></div>}
    <div className="consultation-points"><span><UserRound/><b>Konkreter Ansprechpartner</b><small>Du weißt, mit wem du sprichst.</small></span><span><ShieldCheck/><b>Geprüfter Partner</b><small>Passend zu deinem Thema und deiner Region.</small></span><span><Camera/><b>Foto oder Video</b><small>Privat gespeichert und nur am Vorgang verwendet.</small></span></div>
    <form action={createConsultationAction} className="consultation-form">
      <label>Wobei brauchst du Rat?<textarea name="description" rows={6} minLength={4} maxLength={8000} required placeholder="Zum Beispiel: Mein Dach ist an einer Stelle feucht. Was könnte die Ursache sein?"/></label>
      <label>Foto oder Video <small>(optional)</small><input type="file" name="photo" accept="image/jpeg,image/png,image/webp,image/heic,video/mp4,video/webm,video/quicktime,video/x-m4v"/><small>JPEG, PNG, WebP oder HEIC bis 8 MB; MP4, WebM, MOV oder M4V bis 25 MB.</small></label>
      <button className="btn primary wide" type="submit">Ansprechpartner finden</button>
    </form>
    <HausmeisterAssistant showConsultationLink={false}/>
  </AppShell>;
}

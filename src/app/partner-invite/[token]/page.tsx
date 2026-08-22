import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Home,Link2,ShieldCheck } from 'lucide-react';
import { db } from '@/lib/db';
import { Logo } from '@/components/logo';

export default async function PartnerInvite({params}:{params:Promise<{token:string}>}){
  const {token}=await params; const invite=db.prepare(`SELECT i.*,u.first_name,u.last_name,h.address FROM provider_invites i JOIN users u ON u.id=i.homeowner_id JOIN homeowner_profiles h ON h.user_id=i.homeowner_id WHERE i.token=?`).get(token) as any;
  if(!invite)notFound();
  return <main className="auth-page"><div className="auth-card wide-card"><Logo/><Link2 size={34}/><h1>Als Ansprechpartner fürs Haus verbinden</h1><p>{invite.first_name} {invite.last_name} hat <strong>{invite.company_name||invite.email}</strong> für den Bereich <strong>{invite.category||'Haus'}</strong> in der digitalen Hausakte vorgemerkt.</p><div className="transfer-info"><ShieldCheck/><p>Wenn du dein Partnerkonto mit <strong>{invite.email}</strong> anlegst, wird dein Betrieb nach der Registrierung automatisch als Ansprechpartner mit diesem Haus verbunden. Kunden entscheiden weiterhin selbst, ob daraus später ein Auftrag wird.</p></div>{invite.status==='linked'?<div className="alert success">Der Betrieb wurde bereits mit der Hausakte verbunden.</div>:invite.status!=='pending'?<div className="alert error">Diese Einladung ist nicht mehr aktiv.</div>:<Link className="btn primary wide" href={`/register?role=provider&invite=${token}`}>Partnerkonto erstellen</Link>}<Link className="btn ghost wide" href="/"><Home size={16}/>Mehr über Einfach Hausen</Link></div></main>;
}

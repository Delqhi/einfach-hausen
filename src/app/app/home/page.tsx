import Link from 'next/link';
import { CalendarDays, FileText, House, MessageSquare, ShieldCheck } from 'lucide-react';
import { AppShell, SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel } from '@/lib/format';

export default async function MyHome(){
  const u=await requireUser('homeowner');
  const profile=db.prepare('SELECT * FROM homeowner_profiles WHERE user_id=?').get(u.id) as any;
  const appointments=db.prepare(`SELECT a.*,j.title,p.business_name FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.homeowner_id=? AND a.status='confirmed' ORDER BY a.start_at LIMIT 3`).all(u.id) as any[];
  const active=db.prepare(`SELECT id,title,status FROM jobs WHERE homeowner_id=? AND status IN ('accepted','in_progress') ORDER BY updated_at DESC LIMIT 4`).all(u.id) as any[];
  const unread=db.prepare(`SELECT COUNT(*) c FROM messages WHERE recipient_id=? AND read_at IS NULL`).get(u.id) as any;
  const docs=db.prepare(`SELECT COUNT(*) c FROM documents d JOIN jobs j ON j.id=d.job_id WHERE j.homeowner_id=?`).get(u.id) as any;
  return <AppShell role="homeowner" active="/app/home"><div className="home-hero"><House/><div><h1>Mein Haus</h1><p>{profile?.address||profile?.postcode||'Adresse im Profil ergänzen'}</p></div></div><div className="home-stats"><Link href="/app/calendar"><CalendarDays/><b>{appointments.length}</b><span>Nächste Termine</span></Link><Link href="/app/messages"><MessageSquare/><b>{unread.c}</b><span>Neue Nachrichten</span></Link><Link href="/app/documents"><FileText/><b>{docs.c}</b><span>Dokumente</span></Link></div><SectionTitle>Nächste Termine</SectionTitle><div className="stack">{appointments.map(a=><Link href={`/app/jobs/${a.job_id}`} className="appointment" key={a.id}><CalendarDays/><div><strong>{a.title}</strong><p>{a.business_name}</p><small>{dateLabel(a.start_at)}</small></div><span className="status accepted">Bestätigt</span></Link>)}{appointments.length===0&&<div className="empty compact"><p>Noch keine bestätigten Termine.</p></div>}</div><SectionTitle>Aktive Aufträge</SectionTitle><div className="stack">{active.map(j=><Link className="house-job" href={`/app/jobs/${j.id}`} key={j.id}><ShieldCheck/><div><strong>{j.title}</strong><small>{j.status==='in_progress'?'In Arbeit':'Beauftragt'}</small></div></Link>)}{active.length===0&&<div className="empty compact"><p>Derzeit kein laufender Auftrag.</p></div>}</div></AppShell>;
}

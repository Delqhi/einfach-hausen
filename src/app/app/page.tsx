import Link from 'next/link';
import { AlertTriangle,ArrowRight,CalendarDays,ChevronRight,House,MessageCircle,ShieldCheck,UserRound,Wrench } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel } from '@/lib/format';
import { groupContactsByCategory } from '@/lib/contact-categories';

export default async function Dashboard(){
  const user=await requireUser('homeowner'); const profile=db.prepare('SELECT address,postcode FROM homeowner_profiles WHERE user_id=?').get(user.id) as any;
  const nextAppointment=db.prepare(`SELECT a.*,j.title,p.business_name FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.homeowner_id=? AND a.status='confirmed' AND datetime(a.start_at)>=datetime('now') ORDER BY a.start_at LIMIT 1`).get(user.id) as any;
  const due=(db.prepare(`SELECT COUNT(*) c FROM maintenance_tasks WHERE homeowner_id=? AND status='open' AND due_date<=date('now','+45 day')`).get(user.id) as {c:number}).c;
  const activeJobs=(db.prepare(`SELECT COUNT(*) c FROM jobs WHERE homeowner_id=? AND request_kind='service' AND status IN ('accepted','in_progress')`).get(user.id) as {c:number}).c;
  const contacts=db.prepare(`SELECT hc.*,u.first_name,u.last_name,m.job_title,p.business_name FROM homeowner_contacts hc JOIN users u ON u.id=hc.contact_user_id JOIN provider_members m ON m.user_id=hc.contact_user_id JOIN provider_profiles p ON p.user_id=hc.provider_id WHERE hc.homeowner_id=? ORDER BY hc.updated_at DESC LIMIT 3`).all(user.id) as any[];
  const contactGroups=groupContactsByCategory(contacts).slice(0,4);
  const openOffers=(db.prepare(`SELECT COUNT(*) c FROM jobs j WHERE j.homeowner_id=? AND j.status='quoted'`).get(user.id) as {c:number}).c;
  const issueCount=due+activeJobs+openOffers;
  return <AppShell role="homeowner" active="/app" title="Home" subtitle="Dein Zuhause auf einen Blick">
    <section className="home-overview"><span>Mein Zuhause</span><h1>Guten {new Date().getHours()<12?'Morgen':new Date().getHours()<18?'Tag':'Abend'}, {user.first_name}.</h1><p><House size={15}/>{profile?.address||profile?.postcode||'Hausprofil vervollständigen'}</p><div className={issueCount?'home-state attention':'home-state ok'}>{issueCount?<><AlertTriangle/><div><strong>{issueCount} {issueCount===1?'Ding steht':'Dinge stehen'} an</strong><small>{due?`${due} Wartung${due===1?'':'en'} bald fällig. `:''}{activeJobs?`${activeJobs} Auftrag${activeJobs===1?'':'träge'} aktiv. `:''}{openOffers?`${openOffers} Angebotsentscheidung${openOffers===1?'':'en'} offen.`:''}</small></div></>:<><ShieldCheck/><div><strong>Alles in Ordnung</strong><small>Keine offenen Aufgaben oder Entscheidungen.</small></div></>}</div></section>

    <div className="home-primary-actions"><Link href="/app/emergency" className="emergency-home-button"><AlertTriangle/><span><strong>NOTFALL</strong><small>Sofort Hilfe finden</small></span><ArrowRight/></Link><Link href="/app/consultation" className="consultation-home-button"><MessageCircle/><span><strong>BERATUNG</strong><small>Fachmann fragen</small></span><ArrowRight/></Link></div>

    <Link href="/app/hausmeister" className="service-entry-card calm"><div><small>Hausmeisterservice</small><strong>Etwas erledigen oder einordnen?</strong><p>Beschreib kurz dein Anliegen. Wir zeigen dir den einfachsten nächsten Schritt.</p></div><ChevronRight/></Link>

    <div className="quick-section-head"><strong>Mein nächster Termin</strong><Link href="/app/calendar">Alle Termine <ChevronRight size={14}/></Link></div>
    {nextAppointment?<Link href={`/app/jobs/${nextAppointment.job_id}`} className="next-card"><span className="next-card-icon"><CalendarDays/></span><div className="grow"><small>{dateLabel(nextAppointment.start_at)}</small><strong>{nextAppointment.title}</strong><p>{nextAppointment.business_name}</p></div><ChevronRight/></Link>:<Link href="/app/hausmeister" className="next-card empty-next"><span className="next-card-icon"><CalendarDays/></span><div className="grow"><small>Keine Termine geplant</small><strong>Aktuell nichts im Kalender</strong><p>Neue Arbeiten kannst du jederzeit organisieren.</p></div><ChevronRight/></Link>}

    <div className="quick-section-head"><strong>Meine Ansprechpartner</strong><Link href="/app/messages">Alle Bereiche <ChevronRight size={14}/></Link></div>
    <div className="home-contact-categories">{contactGroups.map(([category,rows])=>{const c=rows[0] as any;return <Link href={`/app/messages?contact=${c.contact_user_id}`} key={category}><span className="home-contact-category">{category}</span><div className="contact-avatar">{c.first_name?.[0]}{c.last_name?.[0]}</div><div className="grow"><strong>{c.first_name} {c.last_name}</strong><small>{c.business_name}{rows.length>1?` · +${rows.length-1} weitere`:''}</small></div><ChevronRight/></Link>})}{contacts.length===0&&<Link href="/app/consultation" className="empty-contact-home"><UserRound/><div><strong>Noch kein Ansprechpartner gespeichert</strong><p>Bei der ersten Beratung oder Buchung entsteht dein persönliches Netzwerk.</p></div><ChevronRight/></Link>}</div>

    <Link href="/app/home" className="home-memory-strip"><House/><div className="grow"><strong>Mein Haus</strong><p>Historie, Technik, Rechnungen und Wartungen an einem Ort.</p></div><Wrench size={17}/></Link>
  </AppShell>;
}

import Link from 'next/link';
import { MessageSquare,Phone,UserRound } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendSavedContactMessageAction } from '@/app/actions';

export default async function Messages({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const u=await requireUser('homeowner'); const sp=await searchParams;
  const contacts=db.prepare(`SELECT hc.*,u.first_name,u.last_name,u.phone,u.email,m.job_title,p.business_name,j.title last_job_title
    FROM homeowner_contacts hc JOIN users u ON u.id=hc.contact_user_id JOIN provider_members m ON m.user_id=hc.contact_user_id JOIN provider_profiles p ON p.user_id=hc.provider_id LEFT JOIN jobs j ON j.id=hc.last_job_id
    WHERE hc.homeowner_id=? ORDER BY hc.updated_at DESC`).all(u.id) as any[];
  const selectedId=Number(sp.contact)||contacts[0]?.contact_user_id; const selected=contacts.find(c=>c.contact_user_id===selectedId);
  const messages=selected?db.prepare('SELECT * FROM contact_messages WHERE homeowner_id=? AND contact_user_id=? ORDER BY created_at').all(u.id,selected.contact_user_id) as any[]:[];
  return <AppShell role="homeowner" active="/app/messages">
    <div className="page-head"><h1 className="page-title">Meine Ansprechpartner</h1><p className="page-subtitle">Menschen, die dein Haus bereits kennen. Für Folgeaufträge kannst du direkt schreiben — ohne neue Vermittlung.</p></div>
    {contacts.length===0?<div className="empty"><UserRound/><strong>Noch keine Ansprechpartner</strong><p>Nach deiner ersten Buchung speichert Einfach Hausen den konkreten Ansprechpartner des Partnerunternehmens automatisch.</p></div>:<>
      <SectionTitle>Ansprechpartner</SectionTitle><div className="contact-list">{contacts.map(c=><Link key={c.contact_user_id} href={`/app/messages?contact=${c.contact_user_id}`} className={selectedId===c.contact_user_id?'contact-row selected':'contact-row'}><div className="contact-avatar">{c.first_name?.[0]}{c.last_name?.[0]}</div><div className="grow"><strong>{c.first_name} {c.last_name}</strong><small>{c.job_title||'Ansprechpartner'} · {c.business_name}</small><p>{c.category||c.last_job_title||'Hausservice'}</p></div></Link>)}</div>
      {selected&&<><SectionTitle>Direkter Kontakt</SectionTitle><div className="contact-card"><UserRound/><div className="grow"><strong>{selected.first_name} {selected.last_name}</strong><p>{selected.job_title||'Ansprechpartner'} · {selected.business_name}</p><small>{selected.last_job_title?`Kennt dein Haus aus: ${selected.last_job_title}`:'Bereits mit deinem Haus verknüpft'}</small></div>{selected.phone&&<a className="icon-contact" href={`tel:${selected.phone}`} aria-label={`${selected.first_name} anrufen`}><Phone/></a>}</div>
        <div className="chat contact-chat">{messages.length===0&&<div className="contact-chat-intro"><MessageSquare/><p>Schreib direkt, z. B. „Kannst du dieses Jahr wieder die Hecke schneiden?“</p></div>}{messages.map((m:any)=><div className={m.sender_id===u.id?'msg mine':'msg'} key={m.id}><small>{m.sender_id===u.id?'Du':selected.first_name}</small><p>{m.body}</p></div>)}<form action={sendSavedContactMessageAction.bind(null,selected.contact_user_id,u.id)} className="chat-form"><input name="body" placeholder={`Nachricht an ${selected.first_name} …`} required/><button aria-label="Nachricht senden">↗</button></form></div>
        <div className="relationship-note"><strong>Bestehende Kundenbeziehung</strong><p>Dieser Kontakt bleibt Teil deiner Hausakte. Wenn du ihn direkt für eine Folgearbeit ansprichst, ist keine neue Partnervermittlung nötig.</p></div></>}
    </>}
  </AppShell>;
}

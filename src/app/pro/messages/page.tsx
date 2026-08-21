import Link from 'next/link';
import { MessageSquare,Phone,UserRound } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendSavedContactMessageAction } from '@/app/actions';
import { getProviderContext } from '@/lib/provider';

export default async function Messages({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const u=await requireUser('provider'); const ctx=getProviderContext(u.id); if(!ctx)return null; const sp=await searchParams;
  const customers=db.prepare(`SELECT hc.*,hu.first_name,hu.last_name,hu.phone,hu.email,h.address,h.postcode,j.title last_job_title
    FROM homeowner_contacts hc JOIN users hu ON hu.id=hc.homeowner_id JOIN homeowner_profiles h ON h.user_id=hc.homeowner_id LEFT JOIN jobs j ON j.id=hc.last_job_id
    WHERE hc.provider_id=? AND hc.contact_user_id=? ORDER BY hc.updated_at DESC`).all(ctx.providerId,u.id) as any[];
  const selectedId=Number(sp.homeowner)||customers[0]?.homeowner_id; const selected=customers.find(c=>c.homeowner_id===selectedId);
  const messages=selected?db.prepare('SELECT * FROM contact_messages WHERE homeowner_id=? AND contact_user_id=? ORDER BY created_at').all(selected.homeowner_id,u.id) as any[]:[];
  return <AppShell role="provider" active="/pro/messages" title="Nachrichten" subtitle="Deine direkten Kundenkontakte">
    {customers.length===0?<div className="empty dark-empty"><MessageSquare/><strong>Noch keine direkten Kontakte</strong><p>Sobald dir eine Kontaktanfrage oder ein Auftrag zugewiesen wurde, kann daraus ein direkter Kundenkontakt entstehen.</p></div>:<>
      <SectionTitle>Kunden</SectionTitle><div className="contact-list pro-contact-list">{customers.map(c=><Link key={c.homeowner_id} href={`/pro/messages?homeowner=${c.homeowner_id}`} className={selectedId===c.homeowner_id?'contact-row selected':'contact-row'}><div className="contact-avatar">{c.first_name?.[0]}{c.last_name?.[0]}</div><div className="grow"><strong>{c.first_name} {c.last_name}</strong><small>{c.address||c.postcode}</small><p>{c.last_job_title||c.category||'Hausservice'}</p></div></Link>)}</div>
      {selected&&<><SectionTitle>Direkter Kontakt</SectionTitle><div className="contact-card pro-contact-card"><UserRound/><div className="grow"><strong>{selected.first_name} {selected.last_name}</strong><p>{selected.address||selected.postcode}</p><small>{selected.last_job_title?`Letzter Auftrag: ${selected.last_job_title}`:'Bestehender Kunde'}</small></div>{selected.phone&&<a className="icon-contact" href={`tel:${selected.phone}`} aria-label={`${selected.first_name} anrufen`}><Phone/></a>}</div>
        <div className="chat pro-chat">{messages.length===0&&<div className="contact-chat-intro"><MessageSquare/><p>Direkter Kontakt zum bestehenden Kunden. Folgeaufträge können ohne neue Vermittlung abgestimmt werden.</p></div>}{messages.map((m:any)=><div className={m.sender_id===u.id?'msg mine':'msg'} key={m.id}><small>{m.sender_id===u.id?'Du':selected.first_name}</small><p>{m.body}</p></div>)}<form action={sendSavedContactMessageAction.bind(null,u.id,selected.homeowner_id)} className="chat-form"><input name="body" placeholder={`Nachricht an ${selected.first_name} …`} required/><button aria-label="Nachricht senden">↗</button></form></div></>}
    </>}
  </AppShell>;
}

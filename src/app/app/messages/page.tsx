import Link from 'next/link';
import { ChevronDown,Layers3,MessageSquare,Phone,UserRound } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendSavedContactMessageAction,updateContactCategoryAction } from '@/app/actions';
import { groupContactsByCategory,normalizeContactCategory,STANDARD_CONTACT_CATEGORIES } from '@/lib/contact-categories';

export default async function Messages({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const u=await requireUser('homeowner'); const sp=await searchParams;
  const contacts=db.prepare(`SELECT hc.*,u.first_name,u.last_name,u.phone,u.email,m.job_title,p.business_name,j.title last_job_title
    FROM homeowner_contacts hc JOIN users u ON u.id=hc.contact_user_id JOIN provider_members m ON m.user_id=hc.contact_user_id JOIN provider_profiles p ON p.user_id=hc.provider_id LEFT JOIN jobs j ON j.id=hc.last_job_id
    WHERE hc.homeowner_id=? ORDER BY hc.updated_at DESC`).all(u.id) as any[];
  const grouped=groupContactsByCategory(contacts);
  const selectedId=Number(sp.contact)||contacts[0]?.contact_user_id; const selected=contacts.find(c=>c.contact_user_id===selectedId);
  const selectedCategory=selected?normalizeContactCategory(selected.category||''):'';
  const messages=selected?db.prepare('SELECT * FROM contact_messages WHERE homeowner_id=? AND contact_user_id=? ORDER BY created_at').all(u.id,selected.contact_user_id) as any[]:[];
  return <AppShell role="homeowner" active="/app/messages" title="Ansprechpartner" subtitle="Dein persönliches Netzwerk fürs Haus">
    <div className="page-head"><h1 className="page-title">Meine Ansprechpartner</h1><p className="page-subtitle">Nach Bereichen sortiert, damit du sofort weißt, wen du für Garten, Dach, Elektro oder andere Themen ansprechen kannst.</p></div>
    {contacts.length===0?<div className="empty"><UserRound/><strong>Noch keine Ansprechpartner</strong><p>Sobald du einen passenden Menschen verbinden lässt oder einen Auftrag buchst, speichert Einfach Hausen den konkreten Ansprechpartner automatisch.</p></div>:<>
      <div className="contact-category-groups">{grouped.map(([category,rows])=><section className="contact-category-group" key={category}><div className="contact-category-title"><span><Layers3 size={15}/>{category}</span><small>{rows.length} {rows.length===1?'Ansprechpartner':'Ansprechpartner'}</small></div><div className="contact-list">{rows.map(c=><Link key={c.contact_user_id} href={`/app/messages?contact=${c.contact_user_id}`} className={selectedId===c.contact_user_id?'contact-row selected':'contact-row'}><div className="contact-avatar">{c.first_name?.[0]}{c.last_name?.[0]}</div><div className="grow"><strong>{c.first_name} {c.last_name}</strong><small>{c.job_title||'Ansprechpartner'} · {c.business_name}</small><p>{c.last_job_title?`Kennt dein Haus aus: ${c.last_job_title}`:'Mit deinem Haus verknüpft'}</p></div></Link>)}</div></section>)}</div>
      {selected&&<><SectionTitle>Direkter Kontakt</SectionTitle>{sp.category==='saved'&&<div className="alert success">Bereich gespeichert.</div>}<div className="contact-card"><UserRound/><div className="grow"><strong>{selected.first_name} {selected.last_name}</strong><p>{selected.job_title||'Ansprechpartner'} · {selected.business_name}</p><small>Bereich: {selectedCategory}</small></div>{selected.phone&&<a className="icon-contact" href={`tel:${selected.phone}`} aria-label={`${selected.first_name} anrufen`}><Phone/></a>}</div>
        <details className="contact-category-editor"><summary><span>Bereich ändern</span><ChevronDown size={15}/></summary><form action={updateContactCategoryAction.bind(null,selected.contact_user_id)}><label>Standardbereich<select name="category" defaultValue={STANDARD_CONTACT_CATEGORIES.includes(selectedCategory as any)?selectedCategory:'Haus & Allgemein'}>{STANDARD_CONTACT_CATEGORIES.map(category=><option value={category} key={category}>{category}</option>)}</select></label><label>Eigener Bereich <small>(optional)</small><input name="customCategory" maxLength={60} placeholder={STANDARD_CONTACT_CATEGORIES.includes(selectedCategory as any)?'z. B. Pool & Sauna':selectedCategory}/><small>Wenn du hier etwas einträgst, wird dieser eigene Bereich verwendet.</small></label><button className="btn ghost">Bereich speichern</button></form></details>
        <div className="chat contact-chat">{messages.length===0&&<div className="contact-chat-intro"><MessageSquare/><p>Schreib direkt, z. B. „Kannst du dieses Jahr wieder die Hecke schneiden?“</p></div>}{messages.map((m:any)=><div className={m.sender_id===u.id?'msg mine':'msg'} key={m.id}><small>{m.sender_id===u.id?'Du':selected.first_name}</small><p>{m.body}</p></div>)}<form action={sendSavedContactMessageAction.bind(null,selected.contact_user_id,u.id)} className="chat-form"><input name="body" placeholder={`Nachricht an ${selected.first_name} …`} required/><button aria-label="Nachricht senden">↗</button></form></div>
        <div className="relationship-note"><strong>Bestehende Kundenbeziehung</strong><p>Dieser Kontakt bleibt Teil deiner Hausakte. Wenn du ihn direkt für eine Folgearbeit ansprichst, ist keine neue Partnervermittlung nötig.</p></div></>}
    </>}
  </AppShell>;
}

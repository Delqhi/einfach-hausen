import { CheckCircle2,UserPlus,Users } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { addProviderMemberAction,updateProviderMemberAction } from '@/app/actions';
import { getProviderContext,getProviderMembers } from '@/lib/provider';

export default async function Team({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const u=await requireUser('provider'); const ctx=getProviderContext(u.id); if(!ctx)return null; const sp=await searchParams;
  const members=getProviderMembers(ctx.providerId);
  return <AppShell role="provider" active="/pro/team" title="Ansprechpartner" subtitle={`${ctx.businessName} · keine komplizierten Rollen`}>
    {sp.error&&<div className="alert error">{sp.error}</div>}{sp.member==='created'&&<div className="alert success"><CheckCircle2/>Ansprechpartner wurde angelegt und kann sich direkt einloggen.</div>}
    <div className="simple-role-principle"><Users/><div><strong>Ein Unternehmen. Ein Team. Ein Schalter.</strong><p>Jeder Ansprechpartner hat einen eigenen App-Zugang. Die einzige wichtige Berechtigung lautet: „Aufträge verwalten“.</p></div></div>

    <SectionTitle>Ansprechpartner</SectionTitle><div className="stack">{members.map(m=><form action={updateProviderMemberAction.bind(null,m.user_id)} className="member-card" key={m.user_id}><div className="member-head"><div className="contact-avatar">{m.first_name?.[0]}{m.last_name?.[0]}</div><div className="grow"><strong>{m.first_name} {m.last_name}{m.user_id===ctx.providerId?' · Firmenkonto':''}</strong><small>{m.email}{m.phone?` · ${m.phone}`:''}</small></div></div><label>Bezeichnung<input name="jobTitle" defaultValue={m.job_title||''} placeholder="z. B. Kundendienst, Techniker, Disposition"/></label><div className="member-switches"><label><input type="checkbox" name="canManageJobs" defaultChecked={!!m.can_manage_jobs}/> Aufträge verwalten</label><label><input type="checkbox" name="active" defaultChecked={!!m.active}/> App-Zugang aktiv</label></div><small className="member-explain">{m.can_manage_jobs?'Sieht neue Anfragen, kann Angebote senden und gebuchte Aufträge zuweisen.':'Sieht nur eigene zugewiesene Aufträge und kann mit diesen Kunden kommunizieren.'}</small>{ctx.canManageJobs&&<button className="btn light">Speichern</button>}</form>)}</div>

    {ctx.canManageJobs&&<><SectionTitle>+ Ansprechpartner hinzufügen</SectionTitle><form action={addProviderMemberAction} className="team-add-form"><div className="two"><label>Vorname<input name="firstName" required/></label><label>Nachname<input name="lastName" required/></label></div><label>Funktion<input name="jobTitle" placeholder="z. B. Techniker"/></label><label>E-Mail<input name="email" type="email" required/></label><label>Telefon<input name="phone"/></label><label>Startpasswort<input name="password" type="password" minLength={8} required/><small>Der Ansprechpartner kann sich damit sofort in der Partner-App anmelden.</small></label><label className="team-manage-toggle"><input type="checkbox" name="canManageJobs"/> Darf Aufträge annehmen & verteilen</label><button className="btn light wide"><UserPlus size={16}/>Ansprechpartner anlegen</button></form></>}
  </AppShell>;
}

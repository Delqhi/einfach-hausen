import Link from 'next/link';
import { BadgeCheck,CreditCard,FileCheck2,ShieldAlert,ShieldCheck,UsersRound,WalletCards } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { createStripeOnboardingAction,logoutAction,saveProfileAction,submitVerificationAction } from '@/app/actions';
import { statusLabel } from '@/lib/format';
import { getProviderContext } from '@/lib/provider';

export default async function ProProfile({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const u=await requireUser('provider'); const sp=await searchParams; const ctx=getProviderContext(u.id);
  if(!ctx)return null;
  const p=db.prepare(`SELECT p.*,c.status contract_status,c.customer_discount_bps,c.insurance_verified,c.qualification_verified,c.contract_verified,c.quality_standard_verified,c.response_target_minutes,c.notes contract_notes
    FROM provider_profiles p LEFT JOIN partner_contracts c ON c.provider_id=p.user_id WHERE p.user_id=?`).get(ctx.providerId) as any;
  const v=db.prepare('SELECT * FROM verification_requests WHERE provider_id=?').get(ctx.providerId) as any;
  const subscription=db.prepare(`SELECT s.status,s.plan_slug,s.trial_end,p.title FROM partner_subscriptions s JOIN partner_plans p ON p.slug=s.plan_slug WHERE s.provider_id=?`).get(ctx.providerId) as any;
  return <AppShell role="provider" active="/pro/profile" title="Partnerprofil" subtitle={p?.business_name||ctx.businessName}>
    {sp.verification==='submitted'&&<div className="alert success"><ShieldCheck/>Unternehmensnachweise wurden eingereicht.</div>}
    {sp.verification==='owner'&&<div className="alert error">Unternehmensnachweise kann nur der Firmeninhaber verwalten.</div>}
    {sp.stripe==='ready'&&<div className="alert success"><CreditCard/>Auszahlungen sind vollständig eingerichtet.</div>}
    {sp.stripe==='incomplete'&&<div className="alert error">Stripe-Onboarding ist noch nicht vollständig abgeschlossen.</div>}
    {sp.stripe==='missing'&&<div className="alert error">Stripe ist auf der Plattform noch nicht konfiguriert.</div>}
    {sp.stripe==='owner'&&<div className="alert error">Auszahlungen kann nur der Firmeninhaber einrichten.</div>}

    <div className={p?.verified?'verification-card verified':'verification-card'}>{p?.verified?<ShieldCheck/>:<ShieldAlert/>}<div><strong>{p?.verified?'Unternehmen geprüft':'Unternehmensprüfung erforderlich'}</strong><p>{p?.verified?'Identität und eingereichte Unternehmensnachweise sind geprüft.':v?`Prüfstatus: ${statusLabel(v.status)}`:'Gewerbe-, Qualifikations- und Versicherungsnachweise müssen geprüft werden.'}</p>{v?.admin_note&&<small>Rückmeldung: {v.admin_note}</small>}</div></div>
    {ctx.isOwner&&!p?.verified&&<><SectionTitle>Nachweise einreichen</SectionTitle><form action={submitVerificationAction} className="document-form"><label>Nachweis<input type="file" name="document" accept="application/pdf,image/*" required/></label><label>Hinweis<textarea name="note" rows={3} placeholder="Gewerbeanmeldung, Meister-/Qualifikationsnachweis, Versicherung …"/></label><button className="btn light">Zur Prüfung einreichen</button></form></>}

    <SectionTitle>Partnervertrag & Standards</SectionTitle><div className={p?.contract_status==='active'?'verification-card verified':'verification-card'}>{p?.contract_status==='active'?<BadgeCheck/>:<FileCheck2/>}<div><strong>{p?.contract_status==='active'?'Aktiver Einfach-Hausen-Vertragspartner':`Vertragsstatus: ${statusLabel(p?.contract_status||'pending')}`}</strong><p>Nur aktive, geprüfte Vertragspartner erhalten passende regionale Kundenanfragen. Das Qualitätsmatching ist unabhängig vom gebuchten Partner-Tarif.</p><div className="contract-checks"><span className={p?.insurance_verified?'ok':''}>{p?.insurance_verified?'✓':'○'} Versicherung</span><span className={p?.qualification_verified?'ok':''}>{p?.qualification_verified?'✓':'○'} Qualifikation</span><span className={p?.contract_verified?'ok':''}>{p?.contract_verified?'✓':'○'} Partnervertrag</span><span className={p?.quality_standard_verified?'ok':''}>{p?.quality_standard_verified?'✓':'○'} Qualitätsstandard</span></div>{p?.contract_status==='active'&&<small>0 % Provision · Reaktionsziel {p.response_target_minutes} Min.</small>}</div></div>

    <SectionTitle>Partner-Tarif</SectionTitle><Link href="/pro/plans" className="verification-card verified"><WalletCards/><div><strong>{subscription?.title||'Free'}</strong><p>{subscription?.status==='trialing'?'Kostenlose Testphase aktiv.':subscription?.status==='active'?'Tarif aktiv.':'Free ist der Standardtarif.'} Alle Tarife: 0 % Provision und keine Gebühr pro Auftrag.</p><small>Tarife ansehen oder ändern</small></div></Link>

    <SectionTitle>Team</SectionTitle><Link href="/pro/team" className="verification-card verified"><UsersRound/><div><strong>Ansprechpartner verwalten</strong><p>Eigener App-Zugang für jeden Ansprechpartner. Nur ein Schalter entscheidet, wer neue Aufträge annehmen und verteilen darf.</p><small>Team öffnen</small></div></Link>

    {ctx.isOwner&&<><SectionTitle>Auszahlungen</SectionTitle><div className={p?.stripe_onboarded?'verification-card verified':'verification-card'}><CreditCard/><div><strong>{p?.stripe_onboarded?'Stripe Connect aktiv':'Stripe Connect einrichten'}</strong><p>{p?.stripe_onboarded?'Der Betrieb erhält 100 % des Auftragswertes. Einfach Hausen berechnet keine Auftragsprovision.':'Für zentrale Plattformzahlungen muss der Firmeninhaber das Auszahlungs-Onboarding abschließen.'}</p>{!p?.stripe_onboarded&&<form action={createStripeOnboardingAction}><button className="btn light">Stripe einrichten</button></form>}</div></div></>}

    <SectionTitle>Mein Profil</SectionTitle><form action={saveProfileAction} className="profile-form pro-form"><div className="two"><label>Vorname<input name="firstName" defaultValue={u.first_name}/></label><label>Nachname<input name="lastName" defaultValue={u.last_name}/></label></div><label>Telefon<input name="phone" defaultValue={u.phone||''}/></label>{ctx.canManageJobs&&<><label>Firmenname<input name="businessName" defaultValue={p?.business_name||''}/></label><label>Gewerke<input name="trades" defaultValue={p?.trades||''} placeholder="z. B. Garten, Elektro, SHK"/></label><div className="two"><label>PLZ<input name="postcode" defaultValue={p?.postcode||''}/></label><label>Einsatzradius km<input name="radius" type="number" min="1" max="200" defaultValue={p?.radius_km||25}/></label></div><label>Beschreibung<textarea name="description" rows={4} defaultValue={p?.description||''}/></label></>}<button className="btn light">Profil speichern</button></form><form action={logoutAction}><button className="btn ghost pro-ghost wide">Ausloggen</button></form>
  </AppShell>;
}

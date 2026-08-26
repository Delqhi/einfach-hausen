import Link from 'next/link';
import { BadgeCheck,CreditCard,FileCheck2,ShieldAlert,ShieldCheck,UsersRound,WalletCards } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { ProviderAccessBoundary,ProviderPageIntro,ProviderState } from '@/components/provider/workspace';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { createStripeOnboardingAction,logoutAction } from '@/app/actions';
import { saveProviderProfileLifecycleAction,submitProviderVerificationAction } from './actions';
import { statusLabel } from '@/lib/format';
import { getProviderContext } from '@/lib/provider';
import { getPartnerActivationCheck } from '@/lib/partner-config';
import { InstallAppCard } from '@/components/install-app-card';

export default async function ProProfile({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const u=await requireUser('provider'); const sp=await searchParams; const ctx=getProviderContext(u.id);
  if(!ctx)return null;
  const p=db.prepare(`SELECT p.*,c.status contract_status,c.customer_discount_bps,c.insurance_verified,c.qualification_verified,c.contract_verified,c.quality_standard_verified,c.response_target_minutes,c.notes contract_notes
    FROM provider_profiles p LEFT JOIN partner_contracts c ON c.provider_id=p.user_id WHERE p.user_id=?`).get(ctx.providerId) as any;
  const v=db.prepare('SELECT * FROM verification_requests WHERE provider_id=?').get(ctx.providerId) as any;
  const activation=getPartnerActivationCheck(ctx.providerId);
  const subscription=db.prepare(`SELECT s.status,s.plan_slug,s.trial_end,p.title FROM partner_subscriptions s JOIN partner_plans p ON p.slug=s.plan_slug WHERE s.provider_id=?`).get(ctx.providerId) as any;
  const prefs=db.prepare('SELECT * FROM provider_preferences WHERE provider_id=?').get(ctx.providerId) as any;
  const emergencyDays=new Set(String(prefs?.emergency_days||'1,2,3,4,5,6,0').split(','));
  const categories=db.prepare(`SELECT slug,title,description FROM provider_categories WHERE active=1 ORDER BY CASE slug WHEN 'handwerk' THEN 1 WHEN 'dienstleistung' THEN 2 WHEN 'makler' THEN 3 WHEN 'gutachter' THEN 4 ELSE 9 END,title`).all() as any[];
  const selectedCategories=new Set((db.prepare(`SELECT category_slug FROM provider_category_assignments WHERE provider_id=?`).all(ctx.providerId) as Array<{category_slug:string}>).map(r=>r.category_slug));
  const services=db.prepare(`SELECT slug,title,category FROM service_catalog WHERE active=1 ORDER BY category,title`).all() as any[];
  const selectedServices=new Set((db.prepare(`SELECT service_slug FROM provider_service_offerings WHERE provider_id=? AND active=1`).all(ctx.providerId) as Array<{service_slug:string}>).map(r=>r.service_slug));
  const brokerProfile=db.prepare(`SELECT * FROM broker_search_profiles WHERE provider_id=?`).get(ctx.providerId) as any;
  return <AppShell role="provider" active="/pro/profile" title="Profil & Vertrauen" subtitle={p?.business_name||ctx.businessName}>
    <ProviderPageIntro eyebrow="Unternehmen" title="Profil & Vertrauen" description="Verifizierung, Vertrag, Auszahlungen und Leistungsprofil an einem Ort. Änderungen an Firma und Einsatzgebiet sind nur für berechtigte Ansprechpartner verfügbar."/>
    <ProviderAccessBoundary canManageJobs={ctx.canManageJobs} />
    <InstallAppCard />
    {sp.verification==='submitted'&&<div className="alert success" role="status"><ShieldCheck/>Unternehmensnachweise wurden eingereicht. Bis zur erneuten Freigabe werden keine neuen Anfragen verteilt.</div>}
    {sp.verification==='file'&&<div className="alert error" role="alert">Bitte lade ein PDF, JPG, PNG oder WebP bis 12 MB hoch.</div>}
    {sp.verification==='owner'&&<div className="alert error">Unternehmensnachweise kann nur der Firmeninhaber verwalten.</div>}
    {sp.profile==='saved'&&<div className="alert success" role="status">Profil und Anfrage-Einstellungen wurden gespeichert.</div>}
    {sp.profile==='review'&&<div className="alert error" role="status">Firmen- oder Leistungsdaten wurden geändert. Die Partnerfreigabe ist pausiert, bis die Nachweise und Vertrags-/Qualitätschecks erneut bestätigt sind.</div>}
    {sp.stripe==='ready'&&<div className="alert success"><CreditCard/>Auszahlungen sind vollständig eingerichtet.</div>}
    {sp.stripe==='incomplete'&&<div className="alert error">Stripe-Onboarding ist noch nicht vollständig abgeschlossen.</div>}
    {sp.stripe==='missing'&&<ProviderState icon={<CreditCard size={21}/>} title="Auszahlungen derzeit nicht verfügbar" description="Die Stripe-Integration ist auf der Plattform noch nicht vollständig konfiguriert. Es wurde nichts an deinem Auszahlungsstatus geändert." tone="unavailable"/>}
    {sp.stripe==='owner'&&<div className="alert error">Auszahlungen kann nur der Firmeninhaber einrichten.</div>}

    <div className={p?.verified?'verification-card verified':'verification-card'}>{p?.verified?<ShieldCheck/>:<ShieldAlert/>}<div><strong>{p?.verified?'Unternehmen geprüft':'Unternehmensprüfung erforderlich'}</strong><p>{p?.verified?'Identität und eingereichte Unternehmensnachweise sind geprüft.':v?`Prüfstatus: ${statusLabel(v.status)}`:'Gewerbe-, Qualifikations- und Versicherungsnachweise müssen geprüft werden.'}</p>{v?.admin_note&&<small>Rückmeldung: {v.admin_note}</small>}</div></div>
    {ctx.isOwner&&!p?.verified&&<><SectionTitle>Nachweise einreichen</SectionTitle><form action={submitProviderVerificationAction} className="document-form"><label>Nachweis<input type="file" name="document" accept="application/pdf,image/jpeg,image/png,image/webp" required/></label><label>Hinweis<textarea name="note" rows={3} placeholder="Gewerbeanmeldung, Meister-/Qualifikationsnachweis, Versicherung …"/></label><button className="btn light">Zur Prüfung einreichen</button></form></>}

    <SectionTitle>Partnervertrag & Standards</SectionTitle><div className={activation.receivesNewJobs?'verification-card verified':'verification-card'}>{activation.receivesNewJobs?<BadgeCheck/>:<FileCheck2/>}<div><strong>{activation.receivesNewJobs?'Aktiver Einfach-Hausen-Vertragspartner':p?.contract_status==='active'?'Freigabe unvollständig':`Vertragsstatus: ${statusLabel(p?.contract_status||'pending')}`}</strong><p>Neue Anfragen gibt es nur bei freigegebener Unternehmensprüfung, aktivem Vertrag und vollständig bestätigten Qualitätschecks. Das Qualitätsmatching ist unabhängig vom gebuchten Partner-Tarif.</p><div className="contract-checks"><span className={activation.insuranceVerified?'ok':''}>{activation.insuranceVerified?'✓':'○'} Versicherung</span><span className={activation.qualificationVerified?'ok':''}>{activation.qualificationVerified?'✓':'○'} Qualifikation</span><span className={activation.contractVerified?'ok':''}>{activation.contractVerified?'✓':'○'} Partnervertrag</span><span className={activation.qualityStandardVerified?'ok':''}>{activation.qualityStandardVerified?'✓':'○'} Qualitätsstandard</span></div>{activation.missing.length>0&&<small>Noch offen: {activation.missing.join(' · ')}</small>}{activation.receivesNewJobs&&<small>0 % Provision · Reaktionsziel {p.response_target_minutes} Min.</small>}</div></div>

    <SectionTitle>Partner-Tarif</SectionTitle><Link href="/pro/plans" className="verification-card verified"><WalletCards/><div><strong>{subscription?.title||'Free'}</strong><p>{subscription?.status==='trialing'?'Kostenlose Testphase aktiv.':subscription?.status==='active'?'Tarif aktiv.':'Free ist der Standardtarif.'} Alle Tarife: 0 % Provision und keine Gebühr pro Auftrag.</p><small>Tarife ansehen oder ändern</small></div></Link>

    <SectionTitle>Team</SectionTitle><Link href="/pro/team" className="verification-card verified"><UsersRound/><div><strong>{ctx.canManageJobs?'Ansprechpartner verwalten':'Team ansehen'}</strong><p>{ctx.canManageJobs?'Eigener App-Zugang für jeden Ansprechpartner. Nur ein Schalter entscheidet, wer neue Aufträge annehmen und verteilen darf.':'Du kannst die Ansprechpartner des Betriebs sehen. Änderungen an Zugängen und Auftragsberechtigungen sind für dich nicht verfügbar.'}</p><small>Team öffnen</small></div></Link>

    {ctx.isOwner&&<><SectionTitle>Auszahlungen</SectionTitle><div className={p?.stripe_onboarded?'verification-card verified':'verification-card'}><CreditCard/><div><strong>{p?.stripe_onboarded?'Stripe Connect aktiv':'Stripe Connect einrichten'}</strong><p>{p?.stripe_onboarded?'Der Betrieb erhält 100 % des Auftragswertes. Einfach Hausen berechnet keine Auftragsprovision.':'Für zentrale Plattformzahlungen muss der Firmeninhaber das Auszahlungs-Onboarding abschließen.'}</p>{!p?.stripe_onboarded&&<form action={createStripeOnboardingAction}><button className="btn light">Stripe einrichten</button></form>}</div></div></>}

    <SectionTitle>Mein Profil</SectionTitle>
    <form action={saveProviderProfileLifecycleAction} className="profile-form pro-form">
      <div className="two"><label>Vorname<input name="firstName" defaultValue={u.first_name}/></label><label>Nachname<input name="lastName" defaultValue={u.last_name}/></label></div>
      <label>Telefon<input name="phone" defaultValue={u.phone||''}/></label>
      {ctx.canManageJobs&&<>
        <label>Firmenname<input name="businessName" defaultValue={p?.business_name||''}/></label>
        <label>Firmenlogo <small>(optional)</small><input name="logo" type="file" accept="image/*"/></label>
        <input type="hidden" name="providerCategoriesPresent" value="1"/>
        <fieldset className="provider-category-picker"><legend>Was macht ihr?</legend><p>Ein Konto, beliebig erweiterbar. Die Auswahl steuert passende Funktionen – nicht den Login.</p><div>{categories.map((c:any)=><label key={c.slug}><input type="checkbox" name="providerCategory" value={c.slug} defaultChecked={selectedCategories.has(c.slug)}/><span><strong>{c.title}</strong><small>{c.description}</small></span></label>)}</div></fieldset>
        <label>Gewerke / Leistungen<input name="trades" defaultValue={p?.trades||''} placeholder="z. B. Garten, Elektro, SHK"/></label>
        <input type="hidden" name="serviceProfilePresent" value="1"/>
        <fieldset className="service-offering-picker"><legend>Konkretes Leistungsprofil</legend><p>Damit passende Anfragen präziser gefunden werden können.</p><div>{services.map((service:any)=><label key={service.slug}><input type="checkbox" name="serviceSlug" value={service.slug} defaultChecked={selectedServices.has(service.slug)}/><span>{service.title}</span></label>)}</div></fieldset>
        <label>Firmenanschrift<input name="streetAddress" defaultValue={p?.street_address||''} placeholder="Straße Hausnr., PLZ Ort"/><small>Wird auf Rechnungen verwendet.</small></label>
        <div className="two"><label>PLZ Einsatzgebiet<input name="postcode" defaultValue={p?.postcode||''}/></label><label>Einsatzradius km<input name="radius" type="number" min="1" max="200" defaultValue={p?.radius_km||25}/></label></div>
        <div className="two"><label>Steuernummer<input name="taxId" defaultValue={p?.tax_id||''}/></label><label>USt-IdNr.<input name="vatId" defaultValue={p?.vat_id||''}/></label></div>
        <label>Beschreibung<textarea name="description" rows={4} defaultValue={p?.description||''}/></label>
        <div className="service-preferences"><strong>Welche Anfragen möchtest du bekommen?</strong><label><input type="checkbox" name="acceptsNormalJobs" defaultChecked={prefs?.accepts_normal_jobs!==0}/> Normale Aufträge</label><label><input type="checkbox" name="acceptsShortNotice" defaultChecked={prefs?.accepts_short_notice!==0}/> Kurzfristige Aufträge</label><label><input type="checkbox" name="acceptsConsultation" defaultChecked={prefs?.accepts_consultation!==0}/> Beratung / fachliche Fragen</label><label><input type="checkbox" name="acceptsEmergencies" defaultChecked={!!prefs?.accepts_emergencies}/> Notfälle</label></div>
        <div className="two"><label>Öffnungszeiten<input name="openingHours" defaultValue={prefs?.opening_hours_text||''} placeholder="Mo–Fr 08:00–18:00"/></label><label>Terminzeiten<input name="bookableHours" defaultValue={prefs?.bookable_hours_text||''} placeholder="Mo–Fr 09:00–17:00"/></label></div>
        <div className="emergency-settings"><strong>Notfall-Bereitschaft</strong><div className="three"><label>Modell<select name="emergencyMode" defaultValue={prefs?.emergency_mode||'local'}><option value="local">Nur eigene Notfallzeiten</option><option value="24_7">24/7 Notdienst</option></select></label><label>Von<input name="emergencyStart" type="time" defaultValue={prefs?.emergency_start||'18:00'}/></label><label>Bis<input name="emergencyEnd" type="time" defaultValue={prefs?.emergency_end||'22:00'}/></label></div><div className="emergency-day-picker"><strong>Tage</strong><div>{[['1','Mo'],['2','Di'],['3','Mi'],['4','Do'],['5','Fr'],['6','Sa'],['0','So']].map(([value,label])=><label key={value}><input type="checkbox" name="emergencyDay" value={value} defaultChecked={emergencyDays.has(value)}/><span>{label}</span></label>)}</div></div><label>Max. Notfallzuschlag %<input name="emergencyMarkup" type="number" min="0" max="100" defaultValue={(prefs?.emergency_markup_bps||0)/100}/></label><label><input type="checkbox" name="instantBooking" defaultChecked={!!prefs?.instant_booking}/> Sofort buchbare Termine anbieten</label><label>Wöchentliche Kapazität (Aufträge)<input name="weeklyCapacity" type="number" min="1" max="200" defaultValue={prefs?.weekly_capacity??''} placeholder="unbegrenzt"/></label></div>
        <details className="broker-profile-settings" open={selectedCategories.has('makler')}><summary>Makler-Suchprofil</summary><input type="hidden" name="brokerProfilePresent" value="1"/><p>Nur relevant, wenn „Immobilienmakler“ als Tätigkeit aktiv ist. Dieses Profil wird für passende Immobilienanfragen verwendet.</p><label>Regionen / PLZ<input name="brokerRegions" defaultValue={brokerProfile?.regions_text||p?.postcode||''} placeholder="z. B. 12, 13, Berlin, Potsdam"/></label><label>Immobilientypen<input name="brokerPropertyTypes" defaultValue={brokerProfile?.property_types_text||''} placeholder="Einfamilienhaus, Wohnung, Mehrfamilienhaus"/></label><div className="two"><label>Kaufpreis ab €<input name="brokerMinPrice" type="number" min="0" step="10000" defaultValue={brokerProfile?.min_price!=null?brokerProfile.min_price/100:''}/></label><label>Kaufpreis bis €<input name="brokerMaxPrice" type="number" min="0" step="10000" defaultValue={brokerProfile?.max_price!=null?brokerProfile.max_price/100:''}/></label></div><div className="two"><label>Wohnfläche ab m²<input name="brokerMinLivingArea" type="number" min="0" defaultValue={brokerProfile?.min_living_area??''}/></label><label>Wohnfläche bis m²<input name="brokerMaxLivingArea" type="number" min="0" defaultValue={brokerProfile?.max_living_area??''}/></label></div><div className="two"><label>Grundstück ab m²<input name="brokerMinPlotArea" type="number" min="0" defaultValue={brokerProfile?.min_plot_area??''}/></label><label>Grundstück bis m²<input name="brokerMaxPlotArea" type="number" min="0" defaultValue={brokerProfile?.max_plot_area??''}/></label></div><div className="service-preferences"><label><input type="checkbox" name="brokerResidential" defaultChecked={brokerProfile?.residential!==0}/> Wohnen</label><label><input type="checkbox" name="brokerCommercial" defaultChecked={!!brokerProfile?.commercial}/> Gewerbe</label></div><label>Spezialisierungen<textarea name="brokerSpecialties" rows={3} defaultValue={brokerProfile?.specialties||''} placeholder="z. B. Altbau, Kapitalanlage, Luxusimmobilien"/></label></details>
  <div className="privacy-strip">
    <span>Datenschutzvereinbarung</span>
    <label><input type="checkbox" name="privacyConsent" defaultChecked={!!brokerProfile?.privacyConsent}/> Ich stimme der Datenverarbeitung gemäß Art. 6 DSGVO zu</label>
  </div>
      </>}
      <button className="btn light">Profil speichern</button>
    </form>
    <form action={logoutAction}><button className="btn ghost pro-ghost wide">Ausloggen</button></form>
  </AppShell>;
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PwField } from '@/components/pw-field';
import logoMark from '@/components/marketing/assets/logo-mark.png';
import auth from '@/components/marketing/auth-convergence.module.css';
import {
  BuildingIcon,
  ClipboardSmallIcon,
  ChatFaceIcon,
  FlagDeIcon,
  HeartIcon,
  HomeOutlineIcon,
  MailIcon,
  PersonIcon,
  PhoneIcon,
  PinIcon,
  SearchThinIcon,
  ShieldIcon,
  ShieldSmallIcon,
} from '@/components/icons';
import { registerAction } from '@/app/actions';
import { db } from '@/lib/db';

const ownerBenefits = [
  { icon: <HomeOutlineIcon />, title: 'Zuhause verwalten', text: 'Alle Informationen, Dokumente und Wartungen im Blick.' },
  { icon: <SearchThinIcon />, title: 'Dienstleister finden', text: 'Zuverlässige Profis aus deiner Region finden und vergleichen.' },
  { icon: <ClipboardSmallIcon />, title: 'Aufträge organisieren', text: 'Anfragen stellen, Angebote erhalten und Aufträge verwalten.' },
  { icon: <ShieldSmallIcon />, title: 'Werte erhalten', text: 'Regelmäßige Wartung und Historie steigern den Wert deiner Immobilie.' },
  { icon: <ChatFaceIcon />, title: 'Kommunikation', text: 'Direkt mit Dienstleistern kommunizieren – alles an einem Ort.' },
];

const trust = [
  { icon: <ShieldIcon />, title: 'Sicher & vertrauenswürdig', text: 'Deine Daten sind bei uns sicher und geschützt.' },
  { icon: <PinIcon />, title: 'Regional verbunden', text: 'Wir arbeiten mit geprüften Dienstleistern in deiner Nähe.' },
  { icon: <HeartIcon />, title: 'Einfach & verständlich', text: 'Intuitive Bedienung für ein sorgenfreies Zuhause.' },
];

/** SEO P0: Registrierungs-Flow — nicht indexieren. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Register({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const sp=await searchParams; const provider=sp.role==='provider'; const initialRequest=!provider?String(sp.request||'').trim().slice(0,700):'';
  const categories=provider?db.prepare(`SELECT slug,title,description FROM provider_categories WHERE active=1 ORDER BY CASE slug WHEN 'handwerk' THEN 1 WHEN 'dienstleistung' THEN 2 WHEN 'makler' THEN 3 WHEN 'gutachter' THEN 4 ELSE 9 END,title`).all() as any[]:[];
  const services=provider?db.prepare(`SELECT slug,title,category FROM service_catalog WHERE active=1 ORDER BY category,title`).all() as any[]:[];
  return <main className={['ehn-reg-page safe-top safe-bottom', auth.authConverged, auth.registerPage].join(' ')}>
    <header className="ehn-reg-head">
      {!provider&&<Link className="ehn-reg-back" href="/role" aria-label="Zurück zur Rollenwahl">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="#1c2129" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </Link>}
      <div className="oreg-logo">
        <Image src={logoMark} alt="" width={40} height={30} priority style={{ height: 'auto' }} />
        <div className="role2-logo-word"><span className="role2-logo-green">einfach</span><span className="role2-logo-ink">hausen</span></div>
      </div>
      <p className="oreg-tagline">Dein Zuhause. <span className="green">Alles geregelt.</span></p>
    </header>

    <div className="ehn-reg-hero">
      <h1>{provider?<>Als Anbieter starten</>:<>Willkommen,<br /><span className="green">Eigentümer!</span></>}</h1>
      <p>{provider?'Ein Konto für dein Unternehmen. Tätigkeiten und Leistungen kannst du jederzeit erweitern.':'Behalte dein Zuhause im Blick, finde zuverlässige Dienstleister und verwalte alles an einem Ort.'}</p>
    </div>

    {!provider&&<div className="oreg-benefits">
      {ownerBenefits.map((b, i) => (
        <div className="oreg-benefit" key={b.title}>
          {i > 0 && <div className="benefit-divider" />}
          <div className="oreg-benefit-icon">{b.icon}</div>
          <strong>{b.title}</strong>
          <span>{b.text}</span>
        </div>
      ))}
    </div>}

    <section className="ehn-reg-form-section">
      <h2>Los geht&apos;s – in wenigen Schritten</h2>
      <p className="oreg-form-sub">{provider?'Erstelle dein Anbieter-Konto und lege direkt los.':'Erstelle ein Eigentümer-Konto und lege direkt los.'}</p>
      <form action={registerAction} className="ehn-reg-form">
        {sp.error&&<div className="alert error">{sp.error}</div>}
        <input type="hidden" name="role" value={provider?'provider':'homeowner'}/>
        {initialRequest&&<><div className="register-intent-preview"><small>Dein Anliegen</small><strong>{initialRequest}</strong><span>Nach der Anmeldung machen wir genau hier weiter.</span></div><input type="hidden" name="initialRequest" value={initialRequest}/></>}
        <div className="two ehn-two">
          <label className="pill-field ehn-field"><span className="sr-only-label">Vorname</span><PersonIcon /><input name="firstName" required placeholder="Vorname" autoComplete="given-name"/></label>
          <label className="pill-field ehn-field"><span className="sr-only-label">Nachname</span><PersonIcon /><input name="lastName" required placeholder="Nachname" autoComplete="family-name"/></label>
        </div>
        <label className="pill-field ehn-field"><span className="sr-only-label">E-Mail-Adresse</span><MailIcon /><input name="email" type="email" required placeholder="E-Mail-Adresse" autoComplete="email"/></label>
        <label className="pill-field ehn-field"><span className="sr-only-label">Telefonnummer</span><PhoneIcon width={20} height={20} /><input name="phone" type="tel" placeholder="Telefonnummer (optional)" autoComplete="tel"/></label>
        <PwField name="password" placeholder="Passwort erstellen" hint="Mindestens 8 Zeichen" />
        {!provider&&<>
          <label className="pill-field ehn-field"><span className="sr-only-label">PLZ</span><PinIcon /><input name="postcode" inputMode="numeric" required placeholder="PLZ" autoComplete="postal-code"/></label>
          <label className="pill-field ehn-field"><span className="sr-only-label">Adresse (optional)</span><BuildingIcon /><input name="address" placeholder="Adresse (optional)" autoComplete="street-address"/></label>
        </>}
        {provider&&<>
          <label className="pill-field ehn-field"><span className="sr-only-label">Firmenname</span><BuildingIcon /><input name="businessName" required placeholder="Firmenname" autoComplete="organization"/></label>
          <fieldset className="provider-category-picker"><legend>Was macht ihr?</legend><p>Mehrfachauswahl möglich. Das bestimmt nur passende Funktionen – nicht dein Login.</p><div>{categories.map((c:any)=><label key={c.slug}><input type="checkbox" name="providerCategory" value={c.slug} defaultChecked={c.slug==='handwerk'}/><span><strong>{c.title}</strong><small>{c.description}</small></span></label>)}</div></fieldset>
          <label className="pill-field ehn-field"><span className="sr-only-label">Leistungen / Gewerke</span><GearPickIcon /><input name="trades" placeholder="Leistungen / Gewerke (z. B. Sanitär, Heizung, Garten)" required/></label>
          <fieldset className="service-offering-picker"><legend>Konkrete Leistungen <small>(optional)</small></legend><div>{services.map((service:any)=><label key={service.slug}><input type="checkbox" name="serviceSlug" value={service.slug}/><span>{service.title}</span></label>)}</div></fieldset>
          <label className="pill-field ehn-field ehn-field-file"><span className="sr-only-label">Logo (optional)</span><BuildingIcon /><span className="ehn-file-label">Logo <small>(optional)</small></span><input name="logo" type="file" accept="image/*"/></label>
          <label className="pill-field ehn-field"><span className="sr-only-label">Firmenanschrift</span><BuildingIcon /><input name="streetAddress" placeholder="Firmenanschrift (Straße Hausnr., Ort)"/></label>
          <div className="two ehn-two">
            <label className="pill-field ehn-field"><span className="sr-only-label">PLZ Einsatzgebiet</span><PinIcon /><input name="postcode" inputMode="numeric" required placeholder="PLZ Einsatzgebiet"/></label>
            <label className="pill-field ehn-field"><span className="sr-only-label">Radius in km</span><PinIcon /><input name="radius" type="number" defaultValue="25" min="1" max="200" placeholder="Radius (km)"/></label>
          </div>
          <label className="pill-field ehn-field ehn-field-area"><span className="sr-only-label">Kurzbeschreibung</span><ChatFaceIcon /><textarea name="description" rows={3} placeholder="Kurzbeschreibung: Was macht euren Betrieb aus?"/></label>
          <div className="register-options"><strong>Welche Anfragen möchtest du bekommen?</strong><label><input type="checkbox" name="acceptsConsultation" defaultChecked/> Beratung / Fachfragen</label><label><input type="checkbox" name="acceptsShortNotice" defaultChecked/> Kurzfristige Aufträge</label><label><input type="checkbox" name="acceptsEmergencies"/> Notfallanfragen</label><label><input type="checkbox" name="instantBooking"/> Sofort buchbare Termine anbieten</label></div>
          <div className="two ehn-two">
            <label className="pill-field ehn-field"><span className="sr-only-label">Öffnungszeiten</span><ClockPickIcon /><input name="openingHours" placeholder="Öffnungszeiten (Mo–Fr 08:00–18:00)"/></label>
            <label className="pill-field ehn-field"><span className="sr-only-label">Terminzeiten</span><ClockPickIcon /><input name="bookableHours" placeholder="Terminzeiten (Mo–Fr 09:00–17:00)"/></label>
          </div>
          <div className="emergency-day-picker"><strong>Notfalltage <small>(falls aktiviert)</small></strong><div>{[['1','Mo'],['2','Di'],['3','Mi'],['4','Do'],['5','Fr'],['6','Sa'],['0','So']].map(([value,label])=><label key={value}><input type="checkbox" name="emergencyDay" value={value} defaultChecked={!['6','0'].includes(value)}/><span>{label}</span></label>)}</div></div><input type="hidden" name="emergencyMode" value="local"/><input type="hidden" name="emergencyStart" value="18:00"/><input type="hidden" name="emergencyEnd" value="22:00"/><input type="hidden" name="emergencyMarkup" value="0"/>
        </>}
        <button className="btn primary wide ehn-reg-submit" type="submit">Konto erstellen</button>
      </form>
      <div className="divider-or"><span>oder</span></div>
      <p className="auth-footer">Schon ein Konto? <Link href="/login" className="link-strong">Anmelden</Link></p>
    </section>

    <section className="oreg-trust">
      <div className="oreg-trust-row">
        {trust.map((t) => (
          <div className="oreg-trust-item" key={t.title}><div className="oreg-trust-icon">{t.icon}</div><strong>{t.title}</strong><span>{t.text}</span></div>
        ))}
      </div>
      <div className="oreg-made">
        <div className="oreg-made-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5" stroke="#105258" strokeWidth="1.5" /><path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" stroke="#105258" strokeWidth="1.5" /><path d="M12 14v2.5" stroke="#105258" strokeWidth="1.5" strokeLinecap="round" /></svg></div>
        <div><strong>Sicher. Einfach. Für dich gemacht.</strong><span>Made in Germany <FlagDeIcon /></span></div>
      </div>
    </section>
    <div className="home-indicator" />
  </main>;
}

function GearPickIcon(){return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l2 2h3v3l2 2-2 2v3h-3l-2 2-2-2H7v-3l-2-2 2-2V5h3l2-2z" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="12" cy="12" r="2.6" stroke="#105258" strokeWidth="1.4"/></svg>;}
function ClockPickIcon(){return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="#105258" strokeWidth="1.4"/><path d="M12 7.5V12l3 2" stroke="#105258" strokeWidth="1.4" strokeLinecap="round"/></svg>;}

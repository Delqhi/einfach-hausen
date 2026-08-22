import { Building2,CheckCircle2,ChevronRight,KeyRound,LockKeyhole,ShieldCheck,TrendingUp,UserRound } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { primaryProperty } from '@/lib/properties';
import { euro } from '@/lib/format';
import { grantBrokerContactAction,revokeBrokerContactAction,savePropertyValuationAction,startSaleProcessAction } from '@/app/actions';

export default async function Sale(){
  const user=await requireUser('homeowner'); const property=primaryProperty(user.id); if(!property)return <AppShell role="homeowner" active="/app/home"><div className="empty"><Building2/><strong>Hausprofil fehlt</strong><p>Lege zuerst dein Zuhause unter „Mein Haus“ an.</p></div></AppShell>;
  const valuations=db.prepare(`SELECT * FROM property_valuations WHERE property_id=? ORDER BY created_at DESC LIMIT 5`).all(property.id) as any[];
  const lead=db.prepare(`SELECT * FROM sale_leads WHERE property_id=? AND homeowner_id=? AND status NOT IN ('cancelled') ORDER BY id DESC LIMIT 1`).get(property.id,user.id) as any;
  const matches=lead?db.prepare(`SELECT m.*,p.business_name,p.rating,p.rating_count,s.status share_status FROM broker_lead_matches m JOIN provider_profiles p ON p.user_id=m.provider_id LEFT JOIN property_shares s ON s.property_id=? AND s.provider_id=m.provider_id AND s.purpose='sale' AND s.status='active' WHERE m.sale_lead_id=? ORDER BY m.match_score DESC`).all(property.id,lead.id) as any[]:[];
  return <AppShell role="homeowner" active="/app/home" title="Verkauf & Bewertung" subtitle="Du entscheidest, was geteilt wird">
    <div className="sale-hero"><KeyRound/><div><span>Dein Haus bleibt dein Datensatz</span><h1>Bewerten, verkaufen, passende Makler finden.</h1><p>Hausdaten werden übernommen. Private Rechnungen, Dokumente und Nachrichten bleiben gesperrt, bis du etwas ausdrücklich freigibst.</p></div></div>

    <section className="property-sale-summary"><div><small>Immobilie</small><strong>{property.address||property.postcode||'Mein Zuhause'}</strong><span>{property.property_type||'Eigenheim'}{property.living_area?` · ${property.living_area} m²`:''}</span></div><div><small>Orientierungswert</small><strong>{property.estimated_value_min!=null&&property.estimated_value_max!=null?`${euro(property.estimated_value_min)} – ${euro(property.estimated_value_max)}`:'Noch nicht hinterlegt'}</strong></div></section>

    <SectionTitle>Immobilienbewertung</SectionTitle>
    <form action={savePropertyValuationAction} className="valuation-form"><div><strong>Bewertung anfragen oder vorhandenen Wert speichern</strong><p>Ohne Wertangabe wird eine Bewertungsanfrage vorgemerkt. Wenn dir bereits eine Einschätzung vorliegt, speichere die Spanne direkt in der Hausakte.</p></div><div className="two"><label>Von € <small>(optional)</small><input name="estimatedMin" type="number" min="0" step="1000"/></label><label>Bis € <small>(optional)</small><input name="estimatedMax" type="number" min="0" step="1000"/></label></div><label>Art<select name="valuationType" defaultValue="orientation"><option value="orientation">Orientierungswert</option><option value="expert">Sachverständigenbewertung</option><option value="market">Makler-Marktwert</option></select></label><label>Hinweis<textarea name="notes" rows={3} placeholder="Optional: Besonderheiten, Modernisierungen oder Quelle der vorhandenen Bewertung"/></label><button className="btn ghost">Bewertung speichern / anfragen</button></form>
    {valuations.length>0&&<div className="valuation-history">{valuations.map(v=><div key={v.id}><TrendingUp/><span className="grow"><strong>{v.status==='completed'&&v.estimated_min!=null&&v.estimated_max!=null?`${euro(v.estimated_min)} – ${euro(v.estimated_max)}`:'Bewertung angefragt'}</strong><small>{new Date(v.created_at).toLocaleDateString('de-DE')} · {v.valuation_type}</small></span><span className={`status ${v.status}`}>{v.status==='completed'?'Gespeichert':'Offen'}</span></div>)}</div>}

    <SectionTitle>Ich möchte verkaufen</SectionTitle>
    {!lead||lead.status==='cancelled'?<div className="sale-start-card"><Building2/><div className="grow"><strong>Passende Makler für dein Haus finden</strong><p>Wir vergleichen Suchprofile mit Lage, Immobilientyp, Fläche und – falls vorhanden – Wert. Noch werden keine Kontaktdaten an Makler weitergegeben.</p></div><form action={startSaleProcessAction}><button className="btn primary">Makler finden</button></form></div>:<>
      <div className="privacy-banner"><LockKeyhole/><div><strong>Eigentümer entscheidet über jede Freigabe</strong><p>Makler werden zunächst nur dir vorgeschlagen. Erst mit „Kontakt freigeben“ sieht genau dieser Makler deine Kontaktdaten und eine begrenzte Objektzusammenfassung. Dokumente bleiben privat.</p></div></div>
      <div className="broker-match-list">{matches.map((m:any)=><article key={m.id}><div className="broker-score"><span>{Math.round(m.match_score)}%</span><small>Passung</small></div><div className="grow"><strong>{m.business_name}</strong><p><ShieldCheck/> Geprüfter Partner · {m.rating_count?`${Number(m.rating).toFixed(1)} ★`:'neu im Netzwerk'}</p><small>Abgleich aus Suchgebiet, Immobilientyp, Flächen und Preisprofil.</small></div>{m.share_status==='active'?<form action={revokeBrokerContactAction.bind(null,m.id)}><button className="btn ghost">Freigabe widerrufen</button></form>:<form action={grantBrokerContactAction.bind(null,m.id)}><button className="btn primary">Kontakt freigeben</button></form>}</article>)}{matches.length===0&&<div className="empty"><UserRound/><strong>Noch kein passender Makler im Netzwerk</strong><p>Deine Verkaufsabsicht bleibt gespeichert. Neue passende Anbieter können später automatisch berücksichtigt werden.</p></div>}</div>
    </>}

    <div className="privacy-rules"><CheckCircle2/><div><strong>Was ein Makler niemals automatisch sieht</strong><p>Rechnungen, Versicherungen, private Nachrichten, Zahlungsdaten und vollständige Dokumente der Hausakte werden nicht freigegeben. Jede Freigabe ist zweckgebunden und widerrufbar.</p></div><ChevronRight/></div>
  </AppShell>;
}

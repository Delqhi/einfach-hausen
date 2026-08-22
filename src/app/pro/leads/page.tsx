import { Building2,LockKeyhole,MapPin,UserRound } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getProviderContext } from '@/lib/provider';
import { providerHasCategory } from '@/lib/provider-categories';
import { euro } from '@/lib/format';
import { updateBrokerLeadStatusAction } from '@/app/actions';

export default async function ProLeads(){
  const user=await requireUser('provider'); const ctx=getProviderContext(user.id); if(!ctx)return null;
  const broker=providerHasCategory(ctx.providerId,'makler');
  if(!broker)return <AppShell role="provider" active="/pro" title="Leads" subtitle="Nur für passende Anbieter"><div className="empty dark-empty"><Building2/><strong>Keine Makler-Kategorie aktiv</strong><p>Wenn dein Unternehmen auch Immobilienvermittlung anbietet, kannst du die Tätigkeit im Partnerprofil ergänzen. Es bleibt dasselbe Konto.</p></div></AppShell>;
  const matches=db.prepare(`SELECT m.*,l.status lead_status,l.property_id,pr.address,pr.postcode,pr.property_type,pr.living_area,pr.plot_area,pr.estimated_value_min,pr.estimated_value_max,u.first_name,u.last_name,u.email,u.phone,s.permissions_json FROM broker_lead_matches m JOIN sale_leads l ON l.id=m.sale_lead_id JOIN properties pr ON pr.id=l.property_id JOIN users u ON u.id=l.homeowner_id JOIN property_shares s ON s.property_id=l.property_id AND s.provider_id=m.provider_id AND s.purpose='sale' AND s.status='active' WHERE m.provider_id=? ORDER BY m.updated_at DESC`).all(ctx.providerId) as any[];
  return <AppShell role="provider" active="/pro/leads" title="Immobilien-Leads" subtitle="Nur ausdrücklich freigegebene Kontakte">
    <div className="privacy-banner pro-privacy"><LockKeyhole/><div><strong>Nur freigegebene Daten</strong><p>Du siehst hier nur Anfragen, bei denen der Eigentümer den Kontakt ausdrücklich freigegeben hat. Private Dokumente und vollständige Hausakten bleiben gesperrt.</p></div></div>
    <SectionTitle>Freigegebene Anfragen</SectionTitle>
    <div className="broker-leads">{matches.map((m:any)=><article key={m.id}><div className="broker-lead-head"><span className="broker-score"><b>{Math.round(m.match_score)}%</b><small>Passung</small></span><div className="grow"><strong>{m.property_type||'Immobilie'} in {m.postcode}</strong><p><MapPin/> {m.address||m.postcode}</p></div><span className={`status ${m.status}`}>{m.status}</span></div><div className="broker-lead-grid"><div><small>Eigentümer</small><strong>{m.first_name} {m.last_name}</strong><span>{m.email}</span>{m.phone&&<span>{m.phone}</span>}</div><div><small>Objekt</small><strong>{m.living_area?`${m.living_area} m² Wohnfläche`:'Fläche offen'}</strong><span>{m.plot_area?`${m.plot_area} m² Grundstück`:''}</span></div><div><small>Wert</small><strong>{m.estimated_value_min!=null&&m.estimated_value_max!=null?`${euro(m.estimated_value_min)} – ${euro(m.estimated_value_max)}`:'Noch nicht bewertet'}</strong></div></div><form action={updateBrokerLeadStatusAction.bind(null,m.id)} className="broker-lead-status"><label>Nächster Schritt<select name="status" defaultValue={m.status==='contact_released'?'interested':m.status}><option value="interested">Interesse bestätigt</option><option value="inspection">Besichtigung</option><option value="mandate">Auftrag erhalten</option><option value="sold">Verkauft</option><option value="rejected">Nicht passend</option></select></label><button className="btn light">Status speichern</button></form></article>)}{matches.length===0&&<div className="empty dark-empty"><UserRound/><strong>Noch keine freigegebenen Immobilienanfragen</strong><p>Passende Eigentümer sehen dein Unternehmen zunächst als Vorschlag. Erst nach deren Freigabe erscheint der Kontakt hier.</p></div>}</div>
  </AppShell>;
}

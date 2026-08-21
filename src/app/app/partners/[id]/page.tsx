import Link from 'next/link';
import { ArrowLeft,BadgeCheck,ChevronRight,MapPin,ShieldCheck,Star,Wrench } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function PartnerProfile({params,searchParams}:{params:Promise<{id:string}>,searchParams:Promise<Record<string,string>>}){
  await requireUser('homeowner'); const {id}=await params; const sp=await searchParams; const providerId=Number(id); if(!providerId)notFound();
  const provider=db.prepare(`SELECT p.*,c.status contract_status,c.insurance_verified,c.qualification_verified,c.contract_verified,c.quality_standard_verified FROM provider_profiles p LEFT JOIN partner_contracts c ON c.provider_id=p.user_id WHERE p.user_id=? AND p.verified=1 AND c.status='active'`).get(providerId) as any; if(!provider)notFound();
  const reviews=db.prepare(`SELECT r.rating,r.comment,r.created_at,u.first_name FROM reviews r JOIN users u ON u.id=r.homeowner_id WHERE r.provider_id=? ORDER BY r.created_at DESC LIMIT 5`).all(providerId) as any[];
  const trades=String(provider.trades||'').split(',').map((x:string)=>x.trim()).filter(Boolean).slice(0,6);
  const returnHref=sp.job?`/app/jobs/${Number(sp.job)}`:'/app/jobs';
  return <AppShell role="homeowner" active="/app/jobs" title="Partnerprofil" subtitle="Geprüfter Einfach-Hausen-Partner">
    <Link href={returnHref} className="inline-back"><ArrowLeft/> Zurück</Link>
    <section className="partner-profile-hero"><div className="partner-profile-cover"><span>{provider.business_name?.slice(0,2).toUpperCase()}</span><BadgeCheck/></div><div className="partner-profile-main"><span className="verified-partner"><ShieldCheck/> Geprüfter Partner</span><h1>{provider.business_name}</h1><div className="partner-rating"><Star fill="currentColor"/> <b>{Number(provider.rating||0).toFixed(1)}</b><span>({provider.rating_count||0} Bewertungen)</span></div><p>{provider.description||'Zuverlässiger regionaler Vertragspartner für Arbeiten rund ums Eigenheim.'}</p><div className="partner-tags">{trades.map((t:string)=><span key={t}>{t}</span>)}</div></div></section>
    <section className="profile-facts"><div><MapPin/><span><small>Region</small><strong>{provider.postcode} · bis {provider.radius_km} km</strong></span></div><div><ShieldCheck/><span><small>Standards</small><strong>Vertraglich geprüft</strong></span></div><div><Wrench/><span><small>Leistungen</small><strong>{trades.length||1} Bereiche</strong></span></div></section>
    <div className="partner-quality-list"><div><span>Versicherung</span><b>{provider.insurance_verified?'Geprüft':'In Prüfung'}</b></div><div><span>Qualifikation</span><b>{provider.qualification_verified?'Geprüft':'In Prüfung'}</b></div><div><span>Partnervertrag</span><b>{provider.contract_verified?'Aktiv':'In Prüfung'}</b></div><div><span>Qualitätsstandard</span><b>{provider.quality_standard_verified?'Bestätigt':'In Prüfung'}</b></div></div>
    <div className="quick-section-head"><strong>Bewertungen</strong><span>{provider.rating_count||0} insgesamt</span></div>
    <div className="review-list">{reviews.map((r:any,i:number)=><article key={`${r.created_at}-${i}`}><div><strong>{r.first_name||'Kunde'}</strong><span>★ {r.rating}/5</span></div><p>{r.comment||'Zuverlässig ausgeführt.'}</p></article>)}{reviews.length===0&&<div className="empty compact"><Star/><strong>Noch keine öffentliche Bewertung</strong><p>Der Betrieb ist geprüft und neu im Netzwerk.</p></div>}</div>
    <Link href={returnHref} className="btn primary wide partner-return">{sp.job?'Zum Angebot zurück':'Aufträge ansehen'} <ChevronRight size={16}/></Link>
  </AppShell>;
}

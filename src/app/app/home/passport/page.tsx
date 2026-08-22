import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { euro } from '@/lib/format';
import { Logo } from '@/components/logo';
import { primaryProperty } from '@/lib/properties';

export default async function HousePassport(){
  const user=await requireUser('homeowner'); const property=primaryProperty(user.id); if(!property)return null;
  const entries=db.prepare('SELECT * FROM house_history_entries WHERE property_id=? ORDER BY performed_at DESC').all(property.id) as any[];
  const assets=db.prepare('SELECT * FROM house_assets WHERE property_id=? ORDER BY created_at').all(property.id) as any[];
  return <main className="passport-page"><article className="house-passport"><Logo/><header><span>Digitaler Hauspass</span><h1>{property.address||'Mein Zuhause'}</h1><p>{property.property_type||'Eigenheim'}{property.build_year?` · Baujahr ${property.build_year}`:''}{property.living_area?` · ${property.living_area} m²`:''}</p></header><section><h2>Technik & Ausstattung</h2>{assets.map(a=><div className="passport-row" key={a.id}><strong>{a.name}</strong><span>{a.kind}{a.installed_year?` · ${a.installed_year}`:''}</span></div>)}</section><section><h2>Historie</h2>{entries.map(e=><div className="passport-history" key={e.id}><time>{new Date(e.performed_at+'T12:00:00').toLocaleDateString('de-DE')}</time><div><strong>{e.title}</strong><p>{e.company_name||'Unbekannt'}{e.contact_name?` · ${e.contact_name}`:''}</p></div><span>{e.cost_amount!=null?euro(e.cost_amount):''}</span><small>{e.guarantee_until?`Garantie bis ${new Date(e.guarantee_until+'T12:00:00').toLocaleDateString('de-DE')}`:''}</small></div>)}</section><footer>Bei Einfach Hausen kann nicht nur das Haus, sondern auch seine dokumentierte Geschichte mitgegeben werden.</footer></article><p className="print-hint print-hide">Über die Druckfunktion als PDF speichern oder ausdrucken.</p></main>;
}

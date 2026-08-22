import { db } from './db';

function tokens(value:string){return (value||'').split(/[;,\n]+/).map(v=>v.trim().toLowerCase()).filter(Boolean);}
function rangeScore(value:number|null,min:number|null,max:number|null){
  if(value==null)return 8;
  if(min!=null&&value<min)return Math.max(0,10-(min-value)/Math.max(min,1)*20);
  if(max!=null&&value>max)return Math.max(0,10-(value-max)/Math.max(max,1)*20);
  return 10;
}

export function brokerMatchScore(property:any,profile:any){
  let score=40;
  const regions=tokens(profile.regions_text);
  if(regions.length){const postcode=String(property.postcode||'').toLowerCase();const address=String(property.address||'').toLowerCase();score+=regions.some((r:string)=>postcode.startsWith(r)||address.includes(r))?25:0;}
  else score+=12;
  const types=tokens(profile.property_types_text);
  if(types.length){const type=String(property.property_type||'').toLowerCase();score+=types.some((t:string)=>type.includes(t)||t.includes(type))?15:0;} else score+=8;
  const estimated=property.estimated_value_min!=null&&property.estimated_value_max!=null?Math.round((property.estimated_value_min+property.estimated_value_max)/2):null;
  score+=rangeScore(estimated,profile.min_price,profile.max_price);
  score+=rangeScore(property.living_area,profile.min_living_area,profile.max_living_area);
  score+=rangeScore(property.plot_area,profile.min_plot_area,profile.max_plot_area);
  if(property.use_type==='commercial'&&!profile.commercial)score-=25;
  if(property.use_type==='residential'&&!profile.residential)score-=25;
  return Math.max(0,Math.min(100,Math.round(score)));
}

export function createBrokerMatches(saleLeadId:number){
  const lead=db.prepare(`SELECT l.*,p.* FROM sale_leads l JOIN properties p ON p.id=l.property_id WHERE l.id=?`).get(saleLeadId) as any;
  if(!lead)return [];
  const brokers=db.prepare(`SELECT bp.*,pp.business_name,pp.rating,pp.rating_count FROM broker_search_profiles bp JOIN provider_profiles pp ON pp.user_id=bp.provider_id JOIN provider_category_assignments ca ON ca.provider_id=bp.provider_id AND ca.category_slug='makler' JOIN partner_contracts c ON c.provider_id=bp.provider_id WHERE pp.verified=1 AND c.status='active'`).all() as any[];
  const ranked=brokers.map(b=>({...b,score:brokerMatchScore(lead,b)})).filter(b=>b.score>=35).sort((a,b)=>b.score-a.score).slice(0,12);
  const insert=db.prepare(`INSERT INTO broker_lead_matches(sale_lead_id,provider_id,match_score,status) VALUES(?,?,?,'suggested') ON CONFLICT(sale_lead_id,provider_id) DO UPDATE SET match_score=excluded.match_score,updated_at=CURRENT_TIMESTAMP`);
  for(const b of ranked)insert.run(saleLeadId,b.provider_id,b.score);
  if(ranked.length)db.prepare(`UPDATE sale_leads SET status=CASE WHEN status='interested' THEN 'matched' ELSE status END,updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(saleLeadId);
  return ranked;
}

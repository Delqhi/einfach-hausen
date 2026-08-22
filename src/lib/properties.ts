import { db } from './db';

export type PropertyRecord={
  id:number;
  address:string;
  postcode:string;
  lat:number|null;
  lon:number|null;
  property_type:string;
  build_year:number|null;
  living_area:number|null;
  plot_area:number|null;
  estimated_value_min:number|null;
  estimated_value_max:number|null;
  use_type:'residential'|'commercial'|'mixed';
};

export function primaryProperty(homeownerId:number):PropertyRecord|null{
  return (db.prepare(`SELECT p.* FROM property_ownerships o JOIN properties p ON p.id=o.property_id WHERE o.homeowner_id=? AND o.active=1 ORDER BY o.started_at DESC,o.id DESC LIMIT 1`).get(homeownerId) as PropertyRecord|undefined)||null;
}

export function propertyOwnedBy(homeownerId:number,propertyId:number){
  return !!db.prepare(`SELECT 1 FROM property_ownerships WHERE homeowner_id=? AND property_id=? AND active=1`).get(homeownerId,propertyId);
}

export function propertyVisibleToProvider(providerId:number,propertyId:number,purpose?:string){
  const row=db.prepare(`SELECT permissions_json,purpose FROM property_shares WHERE provider_id=? AND property_id=? AND status='active' ORDER BY granted_at DESC,id DESC LIMIT 1`).get(providerId,propertyId) as {permissions_json:string,purpose:string}|undefined;
  if(!row)return null;
  if(purpose&&row.purpose!==purpose)return null;
  let permissions:string[]=[]; try{permissions=JSON.parse(row.permissions_json);}catch{}
  return {purpose:row.purpose,permissions};
}

export function syncPropertyFromLegacyProfile(homeownerId:number){
  const property=primaryProperty(homeownerId); if(!property)return null;
  const h=db.prepare(`SELECT * FROM homeowner_profiles WHERE user_id=?`).get(homeownerId) as any; if(!h)return property;
  db.prepare(`UPDATE properties SET address=?,postcode=?,lat=?,lon=?,property_type=?,build_year=?,living_area=?,plot_area=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(h.address||'',h.postcode||'',h.lat??null,h.lon??null,h.house_type||'',h.build_year??null,h.living_area??null,h.plot_area??null,property.id);
  return primaryProperty(homeownerId);
}

export function createPropertyForOwner(homeownerId:number,input:{address?:string;postcode?:string;lat?:number|null;lon?:number|null;propertyType?:string;buildYear?:number|null;livingArea?:number|null;plotArea?:number|null}){
  const result=db.prepare(`INSERT INTO properties(address,postcode,lat,lon,property_type,build_year,living_area,plot_area) VALUES(?,?,?,?,?,?,?,?)`).run(input.address||'',input.postcode||'',input.lat??null,input.lon??null,input.propertyType||'',input.buildYear??null,input.livingArea??null,input.plotArea??null);
  const propertyId=Number(result.lastInsertRowid);
  db.prepare(`INSERT INTO property_ownerships(property_id,homeowner_id,active) VALUES(?,?,1)`).run(propertyId,homeownerId);
  return propertyId;
}

export function activeOwnerId(propertyId:number){
  return (db.prepare(`SELECT homeowner_id FROM property_ownerships WHERE property_id=? AND active=1 ORDER BY started_at DESC,id DESC LIMIT 1`).get(propertyId) as {homeowner_id:number}|undefined)?.homeowner_id||null;
}

import { db } from './db';

export const HOUSE_TRANSFER_TTL_DAYS=14;
const HOUSE_TRANSFER_TTL_SQL=`-${HOUSE_TRANSFER_TTL_DAYS} days`;

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

export type HouseTransferLifecycle='active'|'accepted'|'revoked'|'expired';

type HouseTransferLike={status:string;created_at:string};

type TransferCleanupFilter={propertyId?:number;homeownerId?:number};

function normalizedSqliteTimestamp(value:string){
  const trimmed=String(value||'').trim();
  if(!trimmed)return null;
  const hasZone=/Z$|[+-]\d{2}:?\d{2}$/.test(trimmed);
  const parsed=new Date(hasZone?trimmed:`${trimmed.replace(' ','T')}Z`);
  return Number.isFinite(parsed.getTime())?parsed:null;
}

export function houseTransferExpiresAt(createdAt:string){
  const created=normalizedSqliteTimestamp(createdAt);if(!created)return null;
  return new Date(created.getTime()+HOUSE_TRANSFER_TTL_DAYS*24*60*60*1000);
}

export function houseTransferLifecycleStatus(transfer:HouseTransferLike,now=new Date()):HouseTransferLifecycle{
  if(transfer.status==='accepted')return 'accepted';
  const expiresAt=houseTransferExpiresAt(transfer.created_at);
  if(expiresAt&&expiresAt.getTime()<=now.getTime())return 'expired';
  return transfer.status==='active'?'active':'revoked';
}

export function expireStaleHouseTransfers(filter:TransferCleanupFilter={}){
  const clauses=[`status='active'`,`datetime(created_at) <= datetime('now', ?)`];
  const params:(string|number)[]=[HOUSE_TRANSFER_TTL_SQL];
  if(filter.propertyId!=null){clauses.push('property_id=?');params.push(filter.propertyId);}
  if(filter.homeownerId!=null){clauses.push('homeowner_id=?');params.push(filter.homeownerId);}
  const result=db.prepare(`UPDATE house_transfers SET status='revoked' WHERE ${clauses.join(' AND ')}`).run(...params);
  return result.changes;
}

export function revokeTransfersWithoutActiveOwnership(filter:TransferCleanupFilter={}){
  const clauses=[`t.status='active'`,`t.property_id IS NOT NULL`,`NOT EXISTS (SELECT 1 FROM property_ownerships o WHERE o.property_id=t.property_id AND o.homeowner_id=t.homeowner_id AND o.active=1)`];
  const params:number[]=[];
  if(filter.propertyId!=null){clauses.push('t.property_id=?');params.push(filter.propertyId);}
  if(filter.homeownerId!=null){clauses.push('t.homeowner_id=?');params.push(filter.homeownerId);}
  const rows=db.prepare(`SELECT t.id FROM house_transfers t WHERE ${clauses.join(' AND ')}`).all(...params) as {id:number}[];
  if(!rows.length)return 0;
  const ids=rows.map(row=>row.id);
  const placeholders=ids.map(()=>'?').join(',');
  return db.prepare(`UPDATE house_transfers SET status='revoked' WHERE status='active' AND id IN (${placeholders})`).run(...ids).changes;
}

export function cleanupHouseTransfers(filter:TransferCleanupFilter={}){
  return {
    expired:expireStaleHouseTransfers(filter),
    invalidOwnership:revokeTransfersWithoutActiveOwnership(filter),
  };
}

export function primaryProperty(homeownerId:number):PropertyRecord|null{
  cleanupHouseTransfers();
  return (db.prepare(`SELECT p.* FROM property_ownerships o JOIN properties p ON p.id=o.property_id WHERE o.homeowner_id=? AND o.active=1 ORDER BY o.started_at DESC,o.id DESC LIMIT 1`).get(homeownerId) as PropertyRecord|undefined)||null;
}

export function propertyOwnedBy(homeownerId:number,propertyId:number){
  // A stale transfer may already have been selected by a long-lived request before
  // its age was re-evaluated. Returning false in the same authorization check
  // prevents that old token from changing ownership after the 14-day window.
  const expired=expireStaleHouseTransfers({homeownerId,propertyId});
  if(expired>0)return false;
  const owned=!!db.prepare(`SELECT 1 FROM property_ownerships WHERE homeowner_id=? AND property_id=? AND active=1`).get(homeownerId,propertyId);
  if(!owned)revokeTransfersWithoutActiveOwnership({homeownerId,propertyId});
  return owned;
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
  cleanupHouseTransfers({propertyId});
  return (db.prepare(`SELECT homeowner_id FROM property_ownerships WHERE property_id=? AND active=1 ORDER BY started_at DESC,id DESC LIMIT 1`).get(propertyId) as {homeowner_id:number}|undefined)?.homeowner_id||null;
}

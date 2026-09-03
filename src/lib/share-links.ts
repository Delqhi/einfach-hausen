import { db } from './db';

export const PRIVATE_PROPERTY_SHARE_TTL_MS=30*24*60*60*1000;

export type PrivatePropertyPermission='house_history_documents'|'house_history_media';

type PropertyShareDecisionRow={
  homeowner_id:number;
  purpose:string;
  permissions_json:string;
  status:string;
  granted_at:string;
  revoked_at:string|null;
};

function timestampMs(value:string){
  const normalized=/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)?`${value.replace(' ','T')}Z`:value;
  const parsed=Date.parse(normalized);
  return Number.isFinite(parsed)?parsed:null;
}

function permissions(value:string){
  try{
    const parsed=JSON.parse(value);
    return Array.isArray(parsed)&&parsed.every(item=>typeof item==='string')?parsed:[];
  }catch{
    return [];
  }
}

export function propertyShareAllows(
  share:PropertyShareDecisionRow,
  permission:PrivatePropertyPermission,
  nowMs=Date.now(),
){
  if(share.status!=='active'||share.revoked_at||!share.purpose.trim())return false;
  const grantedAt=timestampMs(share.granted_at);
  if(grantedAt===null||grantedAt>nowMs)return false;
  if(nowMs>=grantedAt+PRIVATE_PROPERTY_SHARE_TTL_MS)return false;
  return permissions(share.permissions_json).includes(permission);
}

export function canProviderReadSharedPropertyArtifact(
  providerId:number,
  propertyId:number,
  permission:PrivatePropertyPermission,
  nowMs=Date.now(),
){
  const currentOwner=db.prepare(`SELECT homeowner_id FROM property_ownerships WHERE property_id=? AND active=1 ORDER BY started_at DESC,id DESC LIMIT 1`).get(propertyId) as {homeowner_id:number}|undefined;
  if(!currentOwner)return false;

  const shares=db.prepare(`SELECT homeowner_id,purpose,permissions_json,status,granted_at,revoked_at FROM property_shares WHERE property_id=? AND provider_id=? ORDER BY granted_at DESC,id DESC`).all(propertyId,providerId) as PropertyShareDecisionRow[];
  return shares.some(share=>share.homeowner_id===currentOwner.homeowner_id&&propertyShareAllows(share,permission,nowMs));
}

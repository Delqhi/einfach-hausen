import { createHmac, timingSafeEqual } from 'node:crypto';
import { db } from '../db';

const HEX_SHA256 = /^[a-f0-9]{64}$/i;

export function verifyMetaSignature(rawBody:string,signature:string|null|undefined,secret:string|undefined){
  if(!secret||!signature?.startsWith('sha256='))return false;
  const supplied=signature.slice(7);
  if(!HEX_SHA256.test(supplied))return false;
  const expected=createHmac('sha256',secret).update(rawBody,'utf8').digest();
  const actual=Buffer.from(supplied,'hex');
  return actual.length===expected.length&&timingSafeEqual(actual,expected);
}

export function claimWebhookEvent(source:'whatsapp'|'stripe',eventId:string){
  if(!eventId||eventId.length>255)return false;
  return db.prepare(`INSERT OR IGNORE INTO webhook_events(source,event_id,status) VALUES(?,?,'processing')`).run(source,eventId).changes===1;
}

export function completeWebhookEvent(source:'whatsapp'|'stripe',eventId:string){
  db.prepare(`UPDATE webhook_events SET status='processed',processed_at=CURRENT_TIMESTAMP WHERE source=? AND event_id=?`).run(source,eventId);
}

export function releaseWebhookEvent(source:'whatsapp'|'stripe',eventId:string){
  db.prepare(`DELETE FROM webhook_events WHERE source=? AND event_id=? AND status='processing'`).run(source,eventId);
}

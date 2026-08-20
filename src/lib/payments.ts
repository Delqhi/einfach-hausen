import { db } from './db';
import { createNotification } from './notifications';
import { euro } from './format';
import { getProviderManagerIds } from './provider';

function providerRecipients(jobId:number,providerId:number){const assigned=db.prepare('SELECT contact_user_id FROM job_assignments WHERE job_id=?').get(jobId) as {contact_user_id:number}|undefined;return new Set<number>([...getProviderManagerIds(providerId),...(assigned?[assigned.contact_user_id]:[])]);}

export function markPaymentPaid(sessionId:string){
  const payment=db.prepare(`SELECT pay.*,j.title FROM payments pay JOIN jobs j ON j.id=pay.job_id WHERE pay.stripe_session_id=?`).get(sessionId) as any;
  if(!payment) return null;
  const changed=db.prepare(`UPDATE payments SET status='paid',paid_at=COALESCE(paid_at,CURRENT_TIMESTAMP) WHERE stripe_session_id=? AND status!='paid'`).run(sessionId).changes;
  if(changed){
    createNotification(payment.homeowner_id,'Zahlung erfolgreich',`${euro(payment.amount)} für „${payment.title}“ wurden sicher verbucht.`,`/app/jobs/${payment.job_id}`,'payment');
    for(const recipient of providerRecipients(payment.job_id,payment.provider_id))createNotification(recipient,'Zahlung eingegangen',`Die Kundenzahlung über ${euro(payment.amount)} für „${payment.title}“ wurde verbucht. 0 % Auftragsprovision.`,`/pro/jobs/${payment.job_id}`,'payment');
  }
  return payment;
}

export function markPaymentFailed(sessionId:string){return db.prepare(`UPDATE payments SET status='failed' WHERE stripe_session_id=? AND status='pending'`).run(sessionId).changes;}

import { db } from './db';
import { createNotification } from './notifications';
import { euro } from './format';
import { getProviderManagerIds } from './provider';

export function stripePaymentsConfigured(){
  return Boolean(process.env.STRIPE_SECRET_KEY&&process.env.STRIPE_WEBHOOK_SECRET);
}

function validSessionId(sessionId:string){
  return typeof sessionId==='string'&&sessionId.length>0&&sessionId.length<=255;
}

function providerRecipients(jobId:number,providerId:number){
  const assigned=db.prepare('SELECT contact_user_id FROM job_assignments WHERE job_id=? AND provider_id=?').get(jobId,providerId) as {contact_user_id:number}|undefined;
  return new Set<number>([...getProviderManagerIds(providerId),...(assigned?[assigned.contact_user_id]:[])]);
}

export function markPaymentPaid(sessionId:string){
  if(!validSessionId(sessionId))return null;
  const transition=db.transaction(()=>{
    const payment=db.prepare(`SELECT pay.*,j.title
      FROM payments pay JOIN jobs j ON j.id=pay.job_id
      WHERE pay.stripe_session_id=?`).get(sessionId) as any;
    if(!payment)return {payment:null,changed:false,notify:false};

    const logicalPaidBefore=payment.invoice_id
      ?Boolean(db.prepare(`SELECT 1 FROM payments WHERE invoice_id=? AND id!=? AND status='paid' LIMIT 1`).get(payment.invoice_id,payment.id))
      :Boolean(db.prepare(`SELECT 1 FROM payments WHERE invoice_id IS NULL AND job_id=? AND id!=? AND status='paid' LIMIT 1`).get(payment.job_id,payment.id));

    // A paid webhook may legitimately arrive after an asynchronous failure, but
    // it must never resurrect an already-refunded payment. Stripe remains the
    // authority for this concrete session even if another logical attempt paid.
    const changed=db.prepare(`UPDATE payments
      SET status='paid',paid_at=COALESCE(paid_at,CURRENT_TIMESTAMP)
      WHERE stripe_session_id=? AND status IN ('pending','failed')`).run(sessionId).changes===1;

    if(changed){
      // Once one attempt paid, sibling pending attempts are no longer actionable.
      // A later authenticated paid webhook can still promote such a failed sibling
      // to paid, preserving provider truth without duplicate notifications.
      if(payment.invoice_id){
        db.prepare(`UPDATE payments SET status='failed'
          WHERE invoice_id=? AND id!=? AND status='pending'`).run(payment.invoice_id,payment.id);
        // Authenticated Stripe payment truth wins a race with a browser/provider
        // cancellation that happened while Checkout was still pending.
        db.prepare(`UPDATE invoices
          SET status='paid',paid_at=COALESCE(paid_at,CURRENT_TIMESTAMP),updated_at=CURRENT_TIMESTAMP
          WHERE id=?`).run(payment.invoice_id);
      }else{
        db.prepare(`UPDATE payments SET status='failed'
          WHERE invoice_id IS NULL AND job_id=? AND id!=? AND status='pending'`).run(payment.job_id,payment.id);
      }
    }
    return {payment,changed,notify:changed&&!logicalPaidBefore};
  })();

  const {payment,notify}=transition;
  if(!payment)return null;
  if(notify){
    createNotification(payment.homeowner_id,'Zahlung erfolgreich',`${euro(payment.amount)} für „${payment.title}“ wurden sicher verbucht.`,payment.invoice_id?`/app/invoices/${payment.invoice_id}`:`/app/jobs/${payment.job_id}`,'payment');
    for(const recipient of providerRecipients(payment.job_id,payment.provider_id)){
      createNotification(recipient,'Zahlung eingegangen',`Die Kundenzahlung über ${euro(payment.amount)} für „${payment.title}“ wurde verbucht. 0 % Auftragsprovision.`,payment.invoice_id?`/pro/invoices/${payment.invoice_id}`:`/pro/jobs/${payment.job_id}`,'payment');
    }
  }
  return payment;
}

export function markPaymentFailed(sessionId:string){
  if(!validSessionId(sessionId))return 0;
  // Failed/expired Checkout only closes a pending attempt. A late failure can
  // neither downgrade a paid payment nor overwrite a refund.
  return db.prepare(`UPDATE payments SET status='failed'
    WHERE stripe_session_id=? AND status='pending'`).run(sessionId).changes;
}

export function markPaymentRefunded(sessionId:string){
  if(!validSessionId(sessionId))return null;
  const changed=db.prepare(`UPDATE payments SET status='refunded',refunded_at=COALESCE(refunded_at,CURRENT_TIMESTAMP)
    WHERE stripe_session_id=? AND status IN ('pending','paid','failed')`).run(sessionId).changes;
  return {changed,sessionId};
}

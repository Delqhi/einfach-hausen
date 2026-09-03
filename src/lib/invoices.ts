import { db } from './db';
import { canAccessProviderJob } from './provider';

type ProviderBillingIdentity = {
  providerId:number;
  businessName:string;
  streetAddress:string;
  taxId:string;
  vatId:string;
};

type InvoiceCreationContext = ProviderBillingIdentity & {
  jobId:number;
  homeownerId:number;
  title:string;
  status:string;
  quotedAmount:number;
};

function positiveId(value:number){
  return Number.isSafeInteger(value)&&value>0;
}

function providerBillingIdentity(providerId:number):ProviderBillingIdentity|null{
  if(!positiveId(providerId))return null;
  const row=db.prepare(`SELECT user_id,business_name,street_address,tax_id,vat_id
    FROM provider_profiles WHERE user_id=?`).get(providerId) as {
      user_id:number; business_name:string; street_address:string; tax_id:string; vat_id:string;
    }|undefined;
  if(!row)return null;
  const businessName=row.business_name?.trim();
  const streetAddress=row.street_address?.trim();
  const taxId=row.tax_id?.trim();
  const vatId=row.vat_id?.trim();
  if(!businessName||!streetAddress||(!taxId&&!vatId))return null;
  return {providerId:row.user_id,businessName,streetAddress,taxId,vatId};
}

/**
 * Returns invoice-authoritative service-job context only when the accepted quote
 * belongs to the provider and the provider has the minimum immutable billing
 * identity required before an invoice number may be issued.
 */
export function invoiceCreationContext(actorUserId:number,jobId:number):InvoiceCreationContext|null{
  if(!positiveId(actorUserId)||!positiveId(jobId))return null;
  const authority=canAccessProviderJob(actorUserId,jobId);
  if(!authority)return null;
  const identity=providerBillingIdentity(authority.providerId);
  if(!identity)return null;
  const row=db.prepare(`SELECT j.id job_id,j.homeowner_id,j.title,j.status,q.amount
    FROM jobs j
    JOIN quotes q ON q.id=j.accepted_quote_id
    WHERE j.id=? AND q.provider_id=? AND j.request_kind='service'
      AND j.status IN ('accepted','in_progress','completed')`).get(jobId,authority.providerId) as {
      job_id:number; homeowner_id:number; title:string; status:string; amount:number;
    }|undefined;
  if(!row)return null;
  return {
    ...identity,
    jobId:row.job_id,
    homeownerId:row.homeowner_id,
    title:row.title,
    status:row.status,
    quotedAmount:row.amount,
  };
}

function requireProviderBillingIdentity(providerId:number){
  const identity=providerBillingIdentity(providerId);
  if(!identity)throw new Error('Provider billing identity is incomplete');
  return identity;
}

function ensureInvoiceSequenceTable(){
  db.exec(`CREATE TABLE IF NOT EXISTS invoice_number_sequences (
    provider_id INTEGER PRIMARY KEY REFERENCES provider_profiles(user_id) ON DELETE CASCADE,
    last_value INTEGER NOT NULL DEFAULT 0 CHECK(last_value >= 0),
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
}

function existingMaxSequence(providerId:number){
  const rows=db.prepare('SELECT invoice_number FROM invoices WHERE provider_id=?').all(providerId) as Array<{invoice_number:string}>;
  let max=0;
  for(const {invoice_number} of rows){
    const match=/^EH-\d{4}-(\d+)$/.exec(invoice_number);
    if(!match)continue;
    const value=Number(match[1]);
    if(Number.isSafeInteger(value)&&value>max)max=value;
  }
  return max;
}

/**
 * Atomically reserves a strictly increasing sequence value per provider. The
 * numeric sequence never resets at the year boundary; the year remains part of
 * the human-readable invoice number only. Gaps are acceptable, reuse is not.
 */
export function nextInvoiceNumber(providerId:number){
  requireProviderBillingIdentity(providerId);
  ensureInvoiceSequenceTable();
  const minimumNext=existingMaxSequence(providerId)+1;
  const row=db.prepare(`INSERT INTO invoice_number_sequences(provider_id,last_value)
    VALUES(?,?)
    ON CONFLICT(provider_id) DO UPDATE SET
      last_value=CASE
        WHEN invoice_number_sequences.last_value<excluded.last_value THEN excluded.last_value
        ELSE invoice_number_sequences.last_value+1
      END,
      updated_at=CURRENT_TIMESTAMP
    RETURNING last_value`).get(providerId,minimumNext) as {last_value:number}|undefined;
  if(!row||!Number.isSafeInteger(row.last_value)||row.last_value<1)throw new Error('Unable to reserve invoice number');
  const sequence=row.last_value;
  const year=new Date().getFullYear();
  return `EH-${year}-${String(sequence).padStart(4,'0')}`;
}

export function invoiceWithItems(invoiceId:number){
  if(!positiveId(invoiceId))return null;
  const invoice=db.prepare(`SELECT i.*,j.title job_title,j.request_kind,p.business_name,u.email provider_email,u.phone provider_phone,hu.email homeowner_email
    FROM invoices i
    JOIN jobs j ON j.id=i.job_id AND j.request_kind='service' AND j.homeowner_id=i.homeowner_id
    JOIN quotes q ON q.id=j.accepted_quote_id AND q.provider_id=i.provider_id
    JOIN provider_profiles p ON p.user_id=i.provider_id
    JOIN users u ON u.id=i.provider_id
    JOIN users hu ON hu.id=i.homeowner_id
    WHERE i.id=?`).get(invoiceId) as any;
  if(!invoice)return null;
  const items=db.prepare('SELECT * FROM invoice_items WHERE invoice_id=? ORDER BY position,id').all(invoiceId) as any[];
  return {...invoice,items};
}

export function invoiceStatusLabel(status:string){return status==='draft'?'Entwurf':status==='sent'?'Offen':status==='paid'?'Bezahlt':status==='cancelled'?'Storniert':status;}

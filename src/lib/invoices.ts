import { db } from './db';

export function nextInvoiceNumber(providerId:number){
  const year=new Date().getFullYear();
  const prefix=`EH-${year}-`;
  const row=db.prepare(`SELECT invoice_number FROM invoices WHERE provider_id=? AND invoice_number LIKE ? ORDER BY id DESC LIMIT 1`).get(providerId,`${prefix}%`) as {invoice_number:string}|undefined;
  const previous=row?Number(row.invoice_number.split('-').pop()):0;
  return `${prefix}${String((Number.isFinite(previous)?previous:0)+1).padStart(4,'0')}`;
}

export function invoiceWithItems(invoiceId:number){
  const invoice=db.prepare(`SELECT i.*,j.title job_title,p.business_name,u.email provider_email,u.phone provider_phone,hu.email homeowner_email FROM invoices i JOIN jobs j ON j.id=i.job_id JOIN provider_profiles p ON p.user_id=i.provider_id JOIN users u ON u.id=i.provider_id JOIN users hu ON hu.id=i.homeowner_id WHERE i.id=?`).get(invoiceId) as any;
  if(!invoice)return null;
  const items=db.prepare('SELECT * FROM invoice_items WHERE invoice_id=? ORDER BY position,id').all(invoiceId) as any[];
  return {...invoice,items};
}

export function invoiceStatusLabel(status:string){return status==='draft'?'Entwurf':status==='sent'?'Offen':status==='paid'?'Bezahlt':status==='cancelled'?'Storniert':status;}

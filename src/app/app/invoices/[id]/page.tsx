import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CreditCard,FileText } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { invoiceWithItems } from '@/lib/invoices';
import { InvoiceView } from '@/components/invoice-view';
import { createInvoiceCheckoutAction } from '@/app/actions';

export default async function CustomerInvoice({params,searchParams}:{params:Promise<{id:string}>,searchParams:Promise<Record<string,string>>}){
  const user=await requireUser('homeowner'); const {id}=await params; const sp=await searchParams; const invoice=invoiceWithItems(Number(id));
  if(!invoice||invoice.homeowner_id!==user.id)notFound();
  return <main className="invoice-page"><div className="invoice-page-tools print-hide"><Link href="/app/documents" className="btn ghost"><FileText size={16}/>Dokumente</Link><span className="btn ghost">Drucken / PDF über Browsermenü</span>{invoice.status==='sent'&&<form action={createInvoiceCheckoutAction.bind(null,invoice.id)}><button className="btn primary"><CreditCard size={16}/>Rechnung bezahlen</button></form>}</div>{sp.error&&<div className="alert error print-hide">{sp.error}</div>}{sp.payment==='cancelled'&&<div className="alert error print-hide">Zahlung wurde abgebrochen. Es wurde nichts belastet.</div>}<InvoiceView invoice={invoice}/><p className="print-hint print-hide">Zum Speichern als PDF die Druckfunktion deines Browsers bzw. Geräts verwenden.</p></main>;
}

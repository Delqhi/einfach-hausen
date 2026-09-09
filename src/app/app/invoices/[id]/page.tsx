import { EHDocumentFrame } from "@/design-system";
import { PrintButton } from "@/components/print-button";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CreditCard,FileText } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { invoiceWithItems } from '@/lib/invoices';
import { InvoiceView } from '@/components/invoice-view';
import { EHErrorState } from '@/design-system';
import { createInvoiceCheckoutAction } from '@/app/actions';

export default async function CustomerInvoice({params,searchParams}:{params:Promise<{id:string}>,searchParams:Promise<Record<string,string>>}){
  const user=await requireUser('homeowner'); const {id}=await params; const sp=await searchParams; const invoice=invoiceWithItems(Number(id));
  if(!invoice||invoice.homeowner_id!==user.id)notFound();
  return <EHDocumentFrame><main className="invoice-page"><div className="invoice-page-tools print-hide"><Link href="/app/documents" className="btn ghost"><FileText size={16}/>Dokumente</Link><PrintButton />{invoice.status==='sent'&&<form action={createInvoiceCheckoutAction.bind(null,invoice.id)}><button className="btn primary"><CreditCard size={16}/>Rechnung bezahlen</button></form>}</div><div className="print-hide">{sp.error&&<EHErrorState text={sp.error} />}{sp.payment==='cancelled'&&<EHErrorState text="Zahlung wurde abgebrochen. Es wurde nichts belastet." />}{sp.payment==='unavailable'&&<EHErrorState text="Onlinezahlung ist gerade nicht verfügbar. Die Rechnung bleibt unverändert; stimme die Zahlung direkt mit dem Partner ab oder versuche es später erneut." />}</div><InvoiceView invoice={invoice}/><p className="print-hint print-hide">Zum Speichern als PDF die Druckfunktion deines Browsers bzw. Geräts verwenden.</p></main></EHDocumentFrame>;
}

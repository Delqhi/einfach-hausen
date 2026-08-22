import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FileText,XCircle } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { getProviderContext } from '@/lib/provider';
import { invoiceWithItems } from '@/lib/invoices';
import { InvoiceView } from '@/components/invoice-view';
import { cancelInvoiceAction } from '@/app/actions';

export default async function ProviderInvoice({params,searchParams}:{params:Promise<{id:string}>,searchParams:Promise<Record<string,string>>}){
  const user=await requireUser('provider'); const ctx=getProviderContext(user.id); const {id}=await params; const sp=await searchParams; const invoice=invoiceWithItems(Number(id));
  if(!ctx||!invoice||invoice.provider_id!==ctx.providerId)notFound();
  return <main className="invoice-page pro-invoice-page"><div className="invoice-page-tools print-hide"><Link href={`/pro/jobs/${invoice.job_id}`} className="btn light"><FileText size={16}/>Zum Auftrag</Link><span className="btn ghost pro-ghost">Drucken / PDF über Browsermenü</span>{invoice.status==='sent'&&<form action={cancelInvoiceAction.bind(null,invoice.id)}><button className="btn ghost pro-ghost"><XCircle size={16}/>Rechnung stornieren</button></form>}</div>{sp.sent&&<div className="alert success print-hide">Rechnung wurde an den Eigentümer gesendet.</div>}<InvoiceView invoice={invoice}/></main>;
}

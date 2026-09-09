import { EHLogo, EHHeading } from "@/design-system";
import { euroExact } from '@/lib/format';
import { invoiceStatusLabel } from '@/lib/invoices';

export function InvoiceView({invoice}:{invoice:any}){
  return <article className="invoice-paper">
    <header className="invoice-paper-head"><div><EHLogo href="/" /><small>Rechnung des ausführenden Partnerbetriebs</small></div><div><span className={`status ${invoice.status}`}>{invoiceStatusLabel(invoice.status)}</span><EHHeading as="h1" scale="app">Rechnung {invoice.invoice_number}</EHHeading></div></header>
    <div className="invoice-parties"><section><small>Rechnungssteller</small><strong>{invoice.seller_name}</strong><p>{invoice.seller_address}</p>{invoice.seller_email&&<p>{invoice.seller_email}</p>}{invoice.seller_phone&&<p>{invoice.seller_phone}</p>}{invoice.seller_tax_id&&<p>Steuernr.: {invoice.seller_tax_id}</p>}{invoice.seller_vat_id&&<p>USt-IdNr.: {invoice.seller_vat_id}</p>}</section><section><small>Rechnung an</small><strong>{invoice.buyer_name}</strong><p>{invoice.buyer_address}</p></section></div>
    <div className="invoice-meta"><div><small>Rechnungsdatum</small><strong>{new Date(invoice.issue_date+'T12:00:00').toLocaleDateString('de-DE')}</strong></div><div><small>Leistungsdatum</small><strong>{new Date(invoice.service_date+'T12:00:00').toLocaleDateString('de-DE')}</strong></div><div><small>Zahlbar bis</small><strong>{new Date(invoice.due_date+'T12:00:00').toLocaleDateString('de-DE')}</strong></div><div><small>Auftrag</small><strong>{invoice.job_title}</strong></div></div>
    <div className="invoice-table" role="region" aria-label="Rechnungspositionen"><div className="invoice-table-head"><span>Leistung</span><span>Menge</span><span>Netto</span><span>MwSt.</span><span>Gesamt</span></div>{invoice.items.map((item:any)=><div className="invoice-table-row" key={item.id}><span data-label="Leistung"><strong>{item.description}</strong><small>{item.unit}</small></span><span data-label="Menge">{item.quantity.toLocaleString('de-DE')}</span><span data-label="Netto">{euroExact(item.line_net)}</span><span data-label="MwSt.">{(item.tax_rate_bps/100).toLocaleString('de-DE')} %</span><span data-label="Gesamt">{euroExact(item.line_gross)}</span></div>)}</div>
    <div className="invoice-totals"><div><span>Netto</span><strong>{euroExact(invoice.subtotal_net)}</strong></div><div><span>Umsatzsteuer</span><strong>{euroExact(invoice.tax_amount)}</strong></div><div className="invoice-grand"><span>Rechnungsbetrag</span><strong>{euroExact(invoice.total_gross)}</strong></div></div>
    {invoice.notes&&<div className="invoice-notes"><strong>Hinweis</strong><p>{invoice.notes}</p></div>}
    <footer className="invoice-paper-foot"><p>Diese Rechnung wird vom oben genannten Partnerbetrieb gestellt. Einfach Hausen übermittelt und archiviert sie in der digitalen Hausakte.</p></footer>
  </article>;
}

import { ReceiptText } from 'lucide-react';
import { createInvoiceAction } from '@/app/actions';
import { euro } from '@/lib/format';

export function InvoiceForm({
  jobId,
  defaultAmount,
  primary = false,
  open = false,
}: {
  jobId: number;
  defaultAmount: number;
  primary?: boolean;
  open?: boolean;
}) {
  return (
    <details className="provider-disclosure provider-form-disclosure" id="rechnung-erstellen" open={open}>
      <summary>
        <span className="provider-disclosure-icon"><ReceiptText size={18} /></span>
        <span>
          <strong>Rechnung erstellen</strong>
          <small>Positionen und Steuer prüfen, dann an den Eigentümer senden.</small>
        </span>
      </summary>
      <form action={createInvoiceAction.bind(null, jobId)} className="invoice-form">
        <div className="invoice-form-head">
          <div>
            <strong>Rechnung direkt senden</strong>
            <p>Die Rechnung erscheint sofort beim Eigentümer in „Dokumente“ und kann – falls Stripe Connect eingerichtet ist – direkt bezahlt werden.</p>
          </div>
        </div>
        <div className="three">
          <label>Rechnungsdatum<input name="issueDate" type="date" /><small>Leer = heute</small></label>
          <label>Leistungsdatum<input name="serviceDate" type="date" /><small>Leer = heute</small></label>
          <label>Zahlbar bis<input name="dueDate" type="date" /><small>Leer = 14 Tage</small></label>
        </div>
        <div className="invoice-items-head"><strong>Positionen</strong><small>Nettopreis + MwSt.</small></div>
        <div className="invoice-line">
          <label>Leistung<input name="itemDescription" defaultValue="Ausgeführte Handwerkerleistung" required /></label>
          <label>Menge<input name="itemQuantity" type="number" step="0.01" min="0.01" defaultValue="1" required /></label>
          <label>Einheit<input name="itemUnit" defaultValue="pauschal" required /></label>
          <label>Netto €<input name="itemPrice" type="number" step="0.01" min="0" defaultValue={(defaultAmount / 1.19 / 100).toFixed(2)} required /></label>
          <label>MwSt. %<select name="itemTax" defaultValue="19"><option value="19">19 %</option><option value="7">7 %</option><option value="0">0 %</option></select></label>
        </div>
        <div className="invoice-line">
          <label>Weitere Position <small>(optional)</small><input name="itemDescription" placeholder="z. B. Material" /></label>
          <label>Menge<input name="itemQuantity" type="number" step="0.01" min="0.01" defaultValue="1" /></label>
          <label>Einheit<input name="itemUnit" defaultValue="Stk." /></label>
          <label>Netto €<input name="itemPrice" type="number" step="0.01" min="0" /></label>
          <label>MwSt. %<select name="itemTax" defaultValue="19"><option value="19">19 %</option><option value="7">7 %</option><option value="0">0 %</option></select></label>
        </div>
        <label>Hinweis <small>(optional)</small><textarea name="notes" rows={3} placeholder="Zahlungsziel, Garantiehinweis oder Dankeschön …" /></label>
        <div className="invoice-preview-total"><span>Vorschlag auf Basis des gebuchten Auftrags</span><strong>{euro(defaultAmount)}</strong></div>
        <button className={primary ? 'btn light wide' : 'btn ghost pro-ghost wide'}>Rechnung erstellen & senden</button>
      </form>
    </details>
  );
}

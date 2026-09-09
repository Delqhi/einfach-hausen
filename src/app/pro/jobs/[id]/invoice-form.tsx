import { createInvoiceAction } from '@/app/actions';
import { EHInvoiceEditor } from '@/design-system';

export function InvoiceForm({ jobId, defaultAmount, buyer, job, open = false }: {
  jobId: number; defaultAmount: number; buyer: string; job: string; primary?: boolean; open?: boolean;
}) {
  return <details className="provider-disclosure provider-form-disclosure" id="rechnung-erstellen" open={open}>
    <summary><span><strong>Rechnung erstellen</strong><small>Leistungen, Material und Steuer prüfen, dann senden.</small></span></summary>
    <EHInvoiceEditor embedded buyer={buyer} job={job} action={createInvoiceAction.bind(null, jobId)}
      initialLines={[{id: `job-${jobId}-line-1`, description: 'Ausgeführte Handwerkerleistung', quantity: '1', unit: 'pauschal', price: (defaultAmount / 1.19 / 100).toFixed(2), tax: '19'}]} />
  </details>;
}

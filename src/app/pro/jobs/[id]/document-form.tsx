import { FileUp } from 'lucide-react';
import { uploadDocumentAction } from '@/app/actions';

export function DocumentForm({ jobId }: { jobId: number }) {
  return (
    <details className="provider-disclosure provider-form-disclosure">
      <summary>
        <span className="provider-disclosure-icon"><FileUp size={18} /></span>
        <span>
          <strong>Dokument hinzufügen</strong>
          <small>PDF oder Bild zum Auftrag sicher hinterlegen.</small>
        </span>
      </summary>
      <form action={uploadDocumentAction.bind(null, jobId)} className="document-form">
        <label>
          Dokumenttyp
          <select name="kind" defaultValue="invoice">
            <option value="invoice">Rechnung</option>
            <option value="report">Leistungsnachweis</option>
            <option value="warranty">Garantie</option>
            <option value="other">Sonstiges</option>
          </select>
        </label>
        <label>Titel<input name="title" placeholder="z. B. Rechnung 2026-104" required /></label>
        <label>Datei<input type="file" name="document" accept="application/pdf,image/*" required /></label>
        <button className="btn ghost pro-ghost">Dokument hochladen</button>
      </form>
    </details>
  );
}

import { uploadDocumentAction } from '@/app/actions';
import { EHField, EHInput, EHSelect, EHWorkSection } from '@/design-system';
import { SubmitButton } from '@/components/ui/submit-button';

export function DocumentForm({ jobId }: { jobId: number }) {
  return <form action={uploadDocumentAction.bind(null, jobId)}>
    <EHWorkSection title="Dokument hinzufügen">
      <p>PDF oder Bild zum Auftrag sicher hinterlegen.</p>
      <EHField id="document-kind" label="Dokumenttyp"><EHSelect id="document-kind" name="kind" defaultValue="invoice">
        <option value="invoice">Rechnung</option><option value="report">Leistungsnachweis</option><option value="warranty">Garantie</option><option value="other">Sonstiges</option>
      </EHSelect></EHField>
      <EHField id="document-title" label="Titel"><EHInput id="document-title" name="title" maxLength={160} placeholder="z. B. Wartungsnachweis" required /></EHField>
      <EHField id="document-file" label="Datei"><EHInput id="document-file" type="file" name="document" accept="application/pdf,image/*" required /></EHField>
      <SubmitButton className="btn primary" pendingLabel="Wird hochgeladen …">Dokument hochladen</SubmitButton>
    </EHWorkSection>
  </form>;
}

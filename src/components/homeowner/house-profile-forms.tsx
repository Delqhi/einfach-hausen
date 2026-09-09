import type { ComponentProps } from 'react';
import {
  EHField, EHInput, EHSelect, EHFieldGrid, EHFormSection,
  EHWorkflowForm, EHSubmitButton,
} from '@/design-system';

type FormAction = ComponentProps<'form'>['action'];
export type HouseProfileValues = {
  address?: string | null; postcode?: string | null; house_type?: string | null;
  build_year?: number | null; living_area?: number | null; plot_area?: number | null;
};

export const HOUSE_ASSET_KINDS: Readonly<Record<string, string>> = {
  heating: 'Heizung / Wärmepumpe', pv: 'PV-Anlage', storage: 'Batteriespeicher',
  wallbox: 'Wallbox', roof: 'Dach / Dachrinne', windows: 'Fenster / Türen',
  garden: 'Garten', smarthome: 'Smart Home / Sicherheit',
};

/** Presentation only: keep the existing authorized server action and field names. */
export function HouseProfileForm({ action, profile }: { action: FormAction; profile: HouseProfileValues | null }) {
  return <EHWorkflowForm action={action}>
    <EHFormSection title="Gebäude & Räume" description="Die Grunddaten deines Zuhauses. Ergänze, was du bereits weißt.">
      <EHField id="home-address" label="Adresse"><EHInput id="home-address" name="address" autoComplete="street-address" defaultValue={profile?.address ?? ''} placeholder="Straße, Hausnummer, Ort" /></EHField>
      <EHFieldGrid>
        <EHField id="home-postcode" label="Postleitzahl"><EHInput id="home-postcode" name="postcode" autoComplete="postal-code" defaultValue={profile?.postcode ?? ''} /></EHField>
        <EHField id="home-type" label="Haustyp"><EHSelect id="home-type" name="houseType" defaultValue={profile?.house_type ?? ''}>
          <option value="">Bitte wählen</option>
          {['Einfamilienhaus', 'Doppelhaushälfte', 'Reihenhaus', 'Mehrfamilienhaus', 'Sonstiges'].map(type => <option key={type} value={type}>{type}</option>)}
        </EHSelect></EHField>
        <EHField id="home-buildyear" label="Baujahr"><EHInput id="home-buildyear" name="buildYear" type="number" defaultValue={profile?.build_year ?? ''} /></EHField>
        <EHField id="home-living" label="Wohnfläche (m²)"><EHInput id="home-living" name="livingArea" type="number" step="0.1" defaultValue={profile?.living_area ?? ''} /></EHField>
        <EHField id="home-plot" label="Grundstück (m²)"><EHInput id="home-plot" name="plotArea" type="number" step="0.1" defaultValue={profile?.plot_area ?? ''} /></EHField>
      </EHFieldGrid>
      <EHSubmitButton pendingLabel="Hausprofil wird gespeichert …">Hausprofil speichern</EHSubmitButton>
    </EHFormSection>
  </EHWorkflowForm>;
}

export function HouseAssetForm({ action }: { action: FormAction }) {
  return <EHWorkflowForm action={action}>
    <EHFormSection title="Technik hinzufügen" description="Halte Geräte und Ausstattung fest, damit das Wissen über dein Haus erhalten bleibt.">
      <EHField id="asset-kind" label="Bereich" required><EHSelect id="asset-kind" name="kind" required defaultValue="">
        <option value="" disabled>Bereich auswählen</option>
        {Object.entries(HOUSE_ASSET_KINDS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </EHSelect></EHField>
      <EHField id="asset-name" label="Bezeichnung" required><EHInput id="asset-name" name="name" placeholder="z. B. Wärmepumpe im Keller" required /></EHField>
      <EHField id="asset-year" label="Installationsjahr (optional)"><EHInput id="asset-year" name="installedYear" type="number" placeholder="z. B. 2024" /></EHField>
      <EHField id="asset-details" label="Modell / Hinweise (optional)"><EHInput id="asset-details" name="details" maxLength={1000} placeholder="Hersteller, Modell oder ein wichtiger Hinweis" /></EHField>
      <EHSubmitButton pendingLabel="Technik wird gespeichert …">Zur Hausakte hinzufügen</EHSubmitButton>
    </EHFormSection>
  </EHWorkflowForm>;
}

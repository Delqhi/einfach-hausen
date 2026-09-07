# Vollständige Quelldateien der Lieferung

Basiscommit: fc7c554. Pfade relativ zu diesem Repository. Dateien vollständig, keine Auslassungszeichen. Binärdateien werden im Manifest mit SHA256 referenziert. Dieses Dokument ist ein Nachschlagewerk; implementiert wird aus den versionierten Quelldateien.

## .gitattributes

`````text

# Generated verbatim source packet preserves inherited Markdown/code whitespace.
docs/brand/system/SOURCE.md whitespace=-blank-at-eol

docs/brand/app-foundation/SOURCE.md whitespace=-blank-at-eol
docs/brand/live-audit/SOURCE.md whitespace=-blank-at-eol

`````

## design/design-lock.json

`````json
{
  "version": "1.0.0",
  "authority": "Jerry explicitly accepted Atelier 02 and commissioned this release on 2026-09-06.",
  "files": {
    ".github/CODEOWNERS": "344048476ff047355aa71baf270bf7ebe41f418ad90195a32009424cc0670e79",
    ".github/workflows/eh-design.yml": "79881db9c76ed3111d37017ea987cb4561d0758d401a1f64a4e2e756183730e1",
    "DESIGN.md": "335971db496fe6762bfdcd823843cb23825c205fa4509c91d8ada6f17a2c5e1a",
    "design/design-debt.json": "272c062b8fedf63def95c347adf45242336ff4667955649c4f4c5e3302de093b",
    "design/design-policy.json": "8858aec4e3d565827a8b744fd8591b1aeaa433cd3dc3ce8bac8447e0dae37881",
    "packages/eh-design/assets/inter-variable.woff2": "0de3908cf5ef213ab1404cc5da94a976faaa886c3479a274a7d66ad80b37c64a",
    "packages/eh-design/assets/logo-full.png": "ca128f0ecfcffc93853f5271453f318be28ed4462850b06072c33afbeb1353cd",
    "packages/eh-design/package.json": "46fdcc913d21cca9abdb515caa916494f6568fddd2a66f32e724c59c8fa79b24",
    "packages/eh-design/src/app.tsx": "e0fd056724bfeb4f6244264c2daba68df73709cb7645bfc7ba2db9a531d8376d",
    "packages/eh-design/src/blocks.tsx": "5f2d07e6883c8958410150192631dc03283d05a31fad164796d48a1cba82935d",
    "packages/eh-design/src/domain-recipes.tsx": "4ab6bc03926690539761d73b55a18ed08da43688cb04c907b80429226d1876a7",
    "packages/eh-design/src/html-style.mjs": "f125fcbd2bdb1c6de36a3e7b1fba8566b2c64f569e3896cf1b31048298dd99b6",
    "packages/eh-design/src/html.css": "c001b6524463cf241edf93c32d309b7bd896cdbc3e666088d0d45c0f7e98f7d1",
    "packages/eh-design/src/html.mjs": "7dde2a71e7eccbe9ddd7888bfb7b8d96a0a91c74e6fd07a2501070abf72d6033",
    "packages/eh-design/src/index.ts": "4983cd1f42d566d975bca5ebdd46f02f5412be8e19a797cfffd9aa52d52c6e1a",
    "packages/eh-design/src/job-forms.tsx": "703eea10b17a9de9ea9712c9821edec878ef61cc498803895e8c1e08c54f8545",
    "packages/eh-design/src/primitives.tsx": "d90af74e98fc45c3af3acb90134621b226902b6aaa0b3d74c9ab558a2fde6edb",
    "packages/eh-design/src/recipes.tsx": "0b56b2c76d10f031aedc5375922495711e61759a57cda1a99a63ecfbc563931f",
    "packages/eh-design/src/styles.module.css": "fe40c33bce9b6731c99812c19ea0ba645169be912671cad1331dad6b31c78adf",
    "packages/eh-design/src/submit-button.tsx": "022785d7044b1e19760d26f9fed643f835c4d3da640692288ef9e3bcfdb52e30",
    "packages/eh-design/src/tokens.css": "4358aae0a1bcb0de84b2e97415b4c6f0356212dbdf67b901590f9dc90cbfc191",
    "packages/eh-design/src/tokens.json": "b399d3041129b93605a0b0a3541424b7ca251032f1b07dbd2bee59289c417e35",
    "packages/eh-design/src/tokens.ts": "afc13c9121be6bf738635eaad8faa17150d27fb12984de9e964047a7e403a5f0",
    "packages/eh-design/src/workflow-layouts.tsx": "66b6bbeacd6d9c0fbd35825b8565a351ad3def4e967af879baa7bb1e4b1c8cb1",
    "scripts/eh-design-check.mjs": "2d4920188c4e961087b75543b5165c48d5d46ef2faa8f11dc33a598f2ac4aade",
    "scripts/eh-design-check.test.mjs": "dbfe6716678ecbad9bf3b1466326f21e8083a78a567fe467e3a21ea32a5b4287",
    "scripts/eh-design-generate.mjs": "55fd71312a134e475c25043da10d11f93ad0ae310310261f153750593dc543f3",
    "scripts/eh-design-seal.mjs": "7be13b011f7cf28530e46d65089b514b4158d036471f768400e5b824e5214024",
    "scripts/eh-design-sync.mjs": "b33e7f99b92b7a717dd6a8794a78ac7d4d2e962553888783c9e416daa1674629",
    "src/app/app/homeowner.module.css": "a483bea8f8ae24cd74dddf79da6fd556217559aa659e532961d972c695877d80",
    "src/app/design-system.css": "234971f6eeb51a6f6c96fb4e3b73190e159944d7a7ed9d371a5d38874e45c9bd",
    "src/app/globals.css": "4721b8a3af2685c2fbd629be5b2916d643fd0b09f1907f205df791d51818841a",
    "src/app/pro/provider-workspace.module.css": "7b718c05d6a19d7dcb8bdb5b773267538ca0ca0a34645f8228587329adfb706d",
    "src/components/marketing/home-hero.tsx": "3fc1c92bc3d907906d0d98997f3b161090e760f56e1e71cc09c466dce003cf05",
    "src/components/marketing/mkt.module.css": "58a850da9f437dd328fca9b5780abcbcde574829ee006ff3d4cd261127adcf7c",
    "src/components/marketing/site-shell.tsx": "fa9bf21cc77ba7da421b493ef72c555547317bd40e800c4dce5a12b0bc9aa0b4",
    "src/components/marketing/tokens.css": "7cd827cb75fceabf3222b1420dce2524cf1e22789d799be55eb001d3bb4da88b",
    "src/components/marketing/ui.tsx": "b679a29758603d39af5eaab8138d27b3df46de5ef6f12b97acce6b8fd6876039",
    "src/design-system/index.ts": "c5880f7f92770415c9a60609a9c6bd927e44217893bb16f81469b0231d2f9ab7"
  }
}

`````

## docs/brand/live-audit/NEXT_AGENT.md

`````markdown
# Designreview des laufenden Agenten · 2026-09-07

Geprüfter Remote-App-Stand: c6494c3; neue Auftragsdetail-Migration 5d36982. Das aktive Arbeitsverzeichnis enthält fremde Änderungen und wurde nicht bearbeitet. Unveröffentlichte Änderungen können weiter fortgeschritten sein; vor Umsetzung erneut vergleichen.

## Bestätigte Befunde und zuständige Tasks
EH-BRAND-05-APPS / Issue44:
- PR49 ist noch nicht integriert. src/components/shell.tsx enthält CenterLogo-Nachzeichnung, src/components/owner-menu.tsx ebenfalls; Wizard und Team verwenden noch den Vorgänger. Das ist eine Integrationslücke, keine belegte Löschung durch den Agenten. Zuerst PR49 dreiwegeintegrieren.
- src/app/pro/jobs/[id]/page.tsx: Zeilen 139–185 und 219–249 enthalten alte Kontakt-/Angebots-/Zuweisungsformulare; 316–337 alten Chat inklusive nacktem Input. Neue EH-Überschrift und EHPanel reichen nicht für Status fertig. InvoiceForm und Dokumentbereiche sind separat weiter zu prüfen.
- Team-/Wizard-Lücken werden durch PR49 abgedeckt, nicht nochmals neu bauen.
EH-BRAND-06 / Issue39:
- Quellenprüfung und Live-Abnahme getrennt dokumentieren. Website-main besitzt die korrigierten EHProblemNotes/EHComparison/EHProcess-Kompositionen. HTTP-Abrufe von /, /so-funktionierts, /login, /app und /pro liefern aus dieser Laufzeit 403 (http-evidence.json). Das beweist weder einen Produktdefekt noch Erreichbarkeit für normale Nutzer.
- Browserstart scheitert auf OCI an snap-confine/cap_dac_override. Keine Rechte aufgeweicht. Vollformat-Browserprüfung bei 390/736/1440 und echte angemeldete Rollenansichten stehen aus.
- GitNexus impact-Aufruf zunächst mehrdeutig; mit Repo-Pfad Timeout nach 15s. Kein verlässlicher Graph-Nachweis für neue Komponenten. Bestehende Workflow-Funktionen unverändert; drei neue Exporte, noch keine Consumer-Migration.

## Vollständige neue Vorlagen
packages/eh-design/src/job-forms.tsx exportiert EHQuoteForm, EHAssignmentForm und EHJobMessageForm. Gestaltung ausschließlich durch vorhandene kanonische Komponenten, keine neuen CSS-Regeln. Quellkapsel SOURCE.md enthält alle geänderten Dateien vollständig.

## Exakte Übernahme
1. PR49 integrieren, aktuelle main-Website-Exporte und CSS vollständig erhalten. Danach diese Ergänzung übernehmen. Keinen alten SOURCE-Snapshot über aktuellen Code kopieren.
2. In src/app/pro/jobs/[id]/page.tsx EHQuoteForm innerhalb DERSELBEN bestehenden Berechtigungsbedingung einsetzen: action=submitQuoteAction.bind(null,access.id), id="provider-quote", amountCents=quote?.amount, availableAt=quote?.available_at || "", message=quote?.message || "", updating=Boolean(quote). Server erhält weiterhin amount in Euro, availableAt, message. Keine Änderung an Währungskonvertierung oder Servervalidierung.
3. EHAssignmentForm: exakt die bislang angezeigten aktiven Ansprechpartner auf {id: user_id,label: vollständiger Name plus bisherige Funktionsbezeichnung} abbilden. Keine neue Benutzerliste. action und selectedId von bisherigem Formular übernehmen. mode="accept-contact" bei acceptContactRequestAction, "assign" beim ersten assignJobContactAction und "reassign" bei vorhandener Zuweisung. Bestehende Rollen- und Auftragsbedingungen außen erhalten. Leere Liste ergibt expliziten Leerzustand.
4. EHJobMessageForm: id="provider-job-message"; action bleibt isContact ? sendSavedContactMessageAction.bind(null,u.id,access.homeowner_id) : sendMessageAction.bind(null,access.id,access.homeowner_id). Feldname body bleibt. Nur Eingabeformular ersetzt; Nachrichtenverlauf, private Daten, Kontaktfreigaben und Anhänge nicht löschen. Dieser Baustein behauptet keine vollständige Chat-Migration.
5. Ablehnen/Starten/Abschließen bleiben echte separate Aktionen. Passende EHSubmitButton-Formulare verwenden, keine generische Action mit geratenen Parametern. Rechnung und Upload nicht durch Attrappen ersetzen.
6. Pro Route Restliste erstellen: Shell, Überschriften, Formulare, Listen/Chat, Feedback, Dialoge, Druck, Berechtigungen. Erst nach echter Ansicht und Funktionsnachweis vollständig migriert nennen. Nicht passende neue Masken mit konkreten Daten/Zuständen an Designautorität melden.

Validiert: TypeScript --noEmit und kanonischer Design-Check bestanden. Nicht validiert: vollständige Browser-/Rollen-/Formularflüsse, neue Komponenten visuell. Kein Merge oder Deployment.

`````

## docs/brand/live-audit/http-evidence.json

`````json
[
  {
    "path": "/",
    "error": "HTTP Error 403: Forbidden"
  },
  {
    "path": "/so-funktionierts",
    "error": "HTTP Error 403: Forbidden"
  },
  {
    "path": "/login",
    "error": "HTTP Error 403: Forbidden"
  },
  {
    "path": "/app",
    "error": "HTTP Error 403: Forbidden"
  },
  {
    "path": "/pro",
    "error": "HTTP Error 403: Forbidden"
  }
]
`````

## packages/eh-design/src/index.ts

`````ts
export * from "./tokens";
export * from "./primitives";
export * from "./blocks";
export * from "./app";
export * from "./domain-recipes";
export * from "./workflow-layouts";
export * from "./submit-button";
export * from "./job-forms";

`````

## packages/eh-design/src/job-forms.tsx

`````tsx
import type {ComponentProps} from "react";
import {EHField, EHInput, EHSelect, EHTextarea, EHEmptyState} from "./app";
import {EHWorkflowForm, EHFormSection, EHFieldGrid, EHFormFeedback} from "./workflow-layouts";
import {EHSubmitButton} from "./submit-button";
type ServerAction = ComponentProps<"form">["action"];

export function EHQuoteForm({action, id, amountCents, availableAt = "", message = "", updating = false, error}: {
  action: ServerAction; id: string; amountCents?: number; availableAt?: string; message?: string; updating?: boolean; error?: string;
}) {
  return <EHWorkflowForm action={action}><EHFormSection title={updating ? "Angebot aktualisieren" : "Dein Angebot"}>
    {error && <EHFormFeedback kind="error">{error}</EHFormFeedback>}
    <EHFieldGrid>
      <EHField id={id+"-amount"} label="Gesamtpreis (€)" required><EHInput id={id+"-amount"} name="amount" type="number" min="1" required defaultValue={amountCents === undefined ? "" : amountCents/100}/></EHField>
      <EHField id={id+"-available"} label="Verfügbar ab"><EHInput id={id+"-available"} name="availableAt" type="datetime-local" defaultValue={availableAt.slice(0,16)}/></EHField>
    </EHFieldGrid>
    <EHField id={id+"-message"} label="Leistungsumfang" required hint="Beschreibe Leistung, Material, Entsorgung und mögliche Ausschlüsse.">
      <EHTextarea id={id+"-message"} name="message" required defaultValue={message} aria-describedby={id+"-message-hint"}/>
    </EHField>
    <EHSubmitButton pendingLabel="Angebot wird gesendet …">{updating ? "Angebot aktualisieren" : "Angebot senden"}</EHSubmitButton>
  </EHFormSection></EHWorkflowForm>;
}

export function EHAssignmentForm({action, id, contacts, selectedId, mode = "assign", error}: {
  action: ServerAction; id: string; contacts: readonly {id: number; label: string}[]; selectedId?: number;
  mode?: "accept-contact" | "assign" | "reassign"; error?: string;
}) {
  if (!contacts.length) return <EHEmptyState title="Kein Ansprechpartner verfügbar" text="Für diese Zuweisung ist ein aktiver Ansprechpartner erforderlich."/>;
  const label = mode === "accept-contact" ? "Kontakt übernehmen" : mode === "reassign" ? "Zuweisung speichern" : "Ansprechpartner festlegen";
  return <EHWorkflowForm action={action}><EHFormSection title="Verantwortlicher Ansprechpartner">
    {error && <EHFormFeedback kind="error">{error}</EHFormFeedback>}
    <EHField id={id+"-contact"} label="Ansprechpartner" required>
      <EHSelect id={id+"-contact"} name="contactUserId" required defaultValue={selectedId ?? ""}>
        <option value="" disabled>Bitte auswählen</option>
        {contacts.map(contact=><option key={contact.id} value={contact.id}>{contact.label}</option>)}
      </EHSelect>
    </EHField>
    <EHSubmitButton pendingLabel="Wird gespeichert …">{label}</EHSubmitButton>
  </EHFormSection></EHWorkflowForm>;
}

export function EHJobMessageForm({action, id, error}: {action: ServerAction; id: string; error?: string}) {
  return <EHWorkflowForm action={action}><EHFormSection title="Nachricht an deinen Kunden">
    {error && <EHFormFeedback kind="error">{error}</EHFormFeedback>}
    <EHField id={id+"-body"} label="Nachricht" required hint="Für konkrete Rückfragen und Absprachen zu diesem Vorgang.">
      <EHInput id={id+"-body"} name="body" required aria-describedby={id+"-body-hint"}/>
    </EHField>
    <EHSubmitButton pendingLabel="Nachricht wird gesendet …">Nachricht senden</EHSubmitButton>
  </EHFormSection></EHWorkflowForm>;
}

`````

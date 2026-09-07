# App-Abdeckung: belegte Lücken

Stand: Quellcommit703be044d602c7d4ea50a578d6831c3219173660. Statisches Inventar in app-route-inventory.json: 58 page.tsx-Dateien und4 weitere Zustandsdateien im gewählten App/Auth/Admin-Bereich, inklusive Weiterleitungen und Varianten. Keine Zahl einzigartiger Workflows. Verschachtelte Komponenten und Laufzeitzustände sind noch nicht vollständig auditiert. Separate CRM-/Hub-Repos benötigen eigene Inventare.

**Korrektur:** 49 Basiskomponenten und16 Seitenkompositionen bedeuten keine vollständige App-Abdeckung. Edition2 ist geschrieben, noch nicht neu visuell geprüft oder verteilt. Ein generischer Form-/ReactNode-Slot zählt nicht als fertige fachliche Maske.

| Priorität | Familie | Vorhandene Grundlage | Fehlende vollständige Vorgabe |
|---|---|---|---|
|P0|App-Rahmen und Zugang|EHAppHeader und Statusbausteine|Rollenabhängige Shell und Navigation; Betrieb fehlt, Verifizierung/Vertrag ausstehend.|
|P0|Auftrag und Angebot|EHJobDetailPage|Angebot schreiben/annehmen, Disposition, Zuweisung, Start/Abschluss/Storno, Bewertung, Reklamation.|
|P0|Hausmeister und App-Fallaufnahme|EHComposer; öffentliche EHSensitiveServicePage|Anhänge, Antwort-/Auswahlzustände, Beratung/Kontakt/Auftrag unterscheiden, Schadenfall an vorhandenen Vorgang binden.|
|P0|Dokumente, Rechnungsdetail, Zahlung|EHDocumentList, EHBillingPage|Upload/Fortschritt/Fehler, Dokumentdetail, Rechnungspositionen, Checkout/Zahlungsstatus und Storno.|
|P0|Tarif, Verifizierung, Auszahlung|EHPricingPage, EHSettingsPage|Tarifstatus und Wechsel, Zahlungsbestätigung/nicht verfügbar, Nachweise, Partnervertrag, Stripe-Onboarding/Auszahlungen.|
|P0|Onboarding, Team, Einladung|EHAccessPage, EHSettingsPage, EHSteps|Mehrschrittformulare, Kategorien/Arbeitsgebiet, Zurück/Speichern/Fehler, Ansprechpartner/Rechte, Einladungszustände.|
|P0|Verkauf, Freigabe, Hausübergabe|EHOwnerPage, EHTimeline|Bewertung/Maklertreffer, konkrete Freigabe/Widerruf, Übergabelink und Lebenszyklus; öffentliche Seite reicht nicht.|
|P1|Hausprofil, Technik, Wartung|EHOwnerPage, EHAppointmentsPage, EHTimeline|Hausprofil bearbeiten, Technik hinzufügen, Wartung erledigen, Jahresplan, Historie mit Kosten/Garantie/Dateien.|
|P1|Posteingang, Updates, Partner|EHMessageThreadPage, EHList|Gesprächsliste, Kontaktkategorie, ungelesen/gelesen, Pagination, Partnerprofil, Bewertung melden.|
|P1|Druck und Export|Kein vollständiges Druckrezept|Hauspass/Zahlungsbeleg mit Druckhierarchie, Seitenumbrüchen, Original-Logo und echten Fachhinweisen.|
|P1|Admin und Betrieb|EHDataTable, EHPanel, EHField|Partnerprüfung, Verträge, Moderation, Fälle, CRM-Bearbeitung, Flags, Lookup, Zustellstatus.|
|P1|Globale und Gerätezustände|EHLoadingState, EHErrorState, EHEmptyState, EHDialog|Offline/Wiederverbindung, Installation, Auth-Wiederherstellung, Fehler/Loading/Not-found, mobile Navigation und bestehende Dialoge.|

## Exakte Fundstellen

### App-Rahmen und Zugang

src/components/shell.tsx; src/components/provider/workspace.tsx

### Auftrag und Angebot

src/app/app/jobs/[id]/page.tsx; src/app/pro/jobs/[id]/page.tsx

### Hausmeister und App-Fallaufnahme

src/app/app/hausmeister/page.tsx; src/app/app/consultation/page.tsx; src/app/app/emergency/page.tsx; src/app/app/insurance/page.tsx; src/components/homeowner/homeowner-hausmeister-composer.tsx

### Dokumente, Rechnungsdetail, Zahlung

src/app/app/documents/page.tsx; src/app/app/invoices/[id]/page.tsx; src/app/pro/invoices/[id]/page.tsx; src/components/invoice-view.tsx

### Tarif, Verifizierung, Auszahlung

src/app/app/plans/page.tsx; src/app/pro/plans/page.tsx; src/app/pro/profile/page.tsx

### Onboarding, Team, Einladung

src/app/app/onboarding/page.tsx; src/app/pro/onboarding/page.tsx; src/app/onboarding/pro/page.tsx; src/app/onboarding/pro/gebiet/page.tsx; src/app/onboarding/pro/[schritt]/page.tsx; src/app/pro/team/page.tsx; src/app/partner-invite/[token]/page.tsx

### Verkauf, Freigabe, Hausübergabe

src/app/app/home/sale/page.tsx; src/app/app/home/history/page.tsx; src/app/transfer/[token]/page.tsx

### Hausprofil, Technik, Wartung

src/app/app/home/page.tsx; src/app/app/home/history/page.tsx; src/app/app/year/page.tsx

### Posteingang, Updates, Partner

src/app/app/messages/page.tsx; src/app/pro/messages/page.tsx; src/app/notifications/page.tsx; src/app/app/partners/[id]/page.tsx

### Druck und Export

src/app/app/home/passport/page.tsx; src/app/app/documents/[jobId]/receipt/page.tsx

### Admin und Betrieb

src/app/admin/page.tsx; src/app/admin/crm/page.tsx; src/app/admin/ops/page.tsx

### Globale und Gerätezustände

src/components/homeowner/network-status.tsx; src/components/provider/network-status.tsx; src/components/install-app-card.tsx; src/components/auth-v2/ForgotPasswordModal.tsx

## EH-BRAND-APP-COVERAGE: begrenzter lokaler Auftrag

Arbeite auf OCI sin-supabase. Quelle /home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906, Branch design/einfachhausen-brand-atelier-20260906, PR41. Lies AGENTS.md, DESIGN.md, DOMAIN_RECIPES_HANDOFF.md, dieses Dokument und app-route-inventory.json vollständig.

Nur Bestandsaufnahme: Folge pro Route den tatsächlich importierten UI-Komponenten und sichtbaren Bedingungen. Dokumentiere Route/Weiterleitung, Rolle/Berechtigung, Shell, Abschnitte, Felder, vorhandene Aktionen, Dialoge, Anhänge, mobile Unterschiede, Lade-/Leer-/Fehler-/Erfolgs-/Offline-/gesperrte Zustände, passende tatsächlich exportierte EH-Rezepte und exakt fehlende Muster. Jede Feststellung braucht Dateipfad und Symbol/bedingten Zweig.

Ergebnis ausschließlich docs/brand/system/app-coverage-report.json und APP_COVERAGE_REPORT.md. Arbeite in einem eigenen isolierten Checkout; fremde Arbeit erhalten. Ergänze separate Inventare für einfachhausen-de/einfach-hausen-crm und portalhub in deren jeweiligen Repos. Deren privaten Quellcode nicht ins öffentliche Hauptrepo kopieren.

KEIN neues Design, keine Produktimplementierung, kein neuer CSS-/Komponenten-/Font-/Farbstil, keine Abhängigkeiten oder API-Änderungen. Keine Nachrichten/Bestellungen/Zahlungen/Deployments/Merges. Keine Anmeldung erfinden. Unklare Laufzeitfälle als ungeprüft kennzeichnen. Runtime-Tests sind für diesen Leseauftrag nicht erforderlich.

JSON-Struktur pro Route:

```json
{"route":"/app/jobs/[id]","file":"src/app/app/jobs/[id]/page.tsx","role":"homeowner","shell":"AppShell","evidence":[],"sections":[],"fields":[],"actions":[],"states":[],"existingRecipes":["EHJobDetailPage"],"missingPatterns":[],"unverified":[]}
```

Keine Komponenten als vorhanden nennen, wenn kein Export existiert. Ein Dateiname oder generischer Slot beweist keine vollständige Unterstützung. Nach diesem Bericht gestaltet Codex die fehlenden Familien und liefert vollständigen Code; der lokale Agent soll vorher nichts improvisieren.

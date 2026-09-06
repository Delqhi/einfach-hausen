# APP_COVERAGE_REPORT — App-Fachabläufe: Bestandsaufnahme (EH-BRAND-APP-COVERAGE)

Stand: Branch `feat/eh-brand-app-coverage`, Quellcommit Atelier-Branch `0efea86` (Inventar-Basis `703be04`). Nur Bestandsaufnahme — kein Design, keine Produktänderung.
Methode: 58 `page.tsx` + 4 Zustandsdateien statisch gelesen; Importe (relativ + `@/`-Alias) eine Ebene vertieft, AuthShell Tiefe 2; Formulare/Felder/Aktionen/Dialoge/Zustände mit Dateipfad + Symbol/Bedingung belegt. Keine Runtime-Tests, keine Test-Anmeldung. Unklare Laufzeitfälle stehen unter `unverified`.
Rezept-Universum (exportiert, Atelier-Branch): 8 `recipes.tsx` (EHArticlePage, EHContactPage, EHHomePage, EHOwnerPage, EHPricingPage, EHProviderPage, EHServiceIndexPage, EHServicePage) + 8 `domain-recipes.tsx` (EHAccessPage, EHAppointmentsPage, EHBillingPage, EHGlossaryEntryPage, EHJobDetailPage, EHMessageThreadPage, EHSensitiveServicePage, EHSettingsPage) + 49 Basis (14 primitives, 20 blocks, 15 app). Dateiname oder generischer Slot zählt nicht als Fachmaske.

## 1. Familien-Abdeckungstabelle

| Familie | Routen | Rezept-Match (belegt) | Kernlücken |
|---|---|---|---|
| Admin/Betrieb (3) | `/admin/crm`, `/admin/ops`, `/admin` | — | Entscheidungs-Workflow mit Begründungspflicht; Vertrags-Lebenszyklus-Ansicht; Moderations-Queue mit Verlauf; Fall-Bearbeitung mit Verlauf; CRM-Flags/Lookup/Zustellstatus-Detail; Lead-Verlauf mit Flags (+6 weitere) |
| Onboarding/Team/Einladung (12) | `/admin/login`, `/app/onboarding`, `/login`, `/onboarding/pro/[schritt]`, `/onboarding/pro/gebiet`, `/onboarding/pro`, `/partner-invite/[token]`, `/pro/onboarding`, `/pro/team`, `/register-owner`, `/register-pro`, `/register` | `EHAccessPage` | Sperr-/MFA-Zustände (ungeprüft); Weiterleitung nach Anmeldung (next-Pfad ungeprüft); Fehlerdarstellung bei Fehlanmeldung (statisch nicht belegt); Mehrschritt-Formularmaske mit Zurück/Speichern/Fehler; Kategorien-/Arbeitsgebiet-Auswahl; Ansprechpartner-/Rechte-Verwaltung (+24 weitere) |
| Hausmeister/Fallaufnahme (9) | `/anfrage/[id]`, `/anfrage/neu`, `/anfragen-pro`, `/app/consultation`, `/app/emergency`, `/app/hausmeister`, `/app/insurance`, `/chat/[anfrageId]`, `/ki-chat` | `EHSensitiveServicePage` | Anhang-Upload mit Fortschritt/Fehler (wo kein file-Input belegt); Antwort-/Auswahlzustände nach Submit; Beratung/Kontakt/Auftrag-Weiche; Schadenfall an bestehenden Vorgang binden; Erfolgs-/Fehlerquittung; Fallback-Werte bewertung:4.8/entfernung:12 statisch belegt — Herkunft ungeprüft (+18 weitere) |
| Termine (2) | `/app/calendar`, `/pro/calendar` | `EHAppointmentsPage` | Zeitraumsteuerung; Termin-Detail mit Statuswechsel; Monatsübersicht (Rezept sieht Tagesagenda vor); Agenda-Zeit/Ort-Darstellung (Rezept-Anspruch ungeprüft) |
| Dokumente/Rechnung/Zahlung (4) | `/app/documents/[jobId]/receipt`, `/app/documents`, `/app/invoices/[id]`, `/pro/invoices/[id]` | `EHBillingPage` | Upload-Dialog mit Fortschritt/Fehler; Dokumentdetail-Ansicht; Rechnungspositionen-Aufschlüsselung; Checkout-/Zahlungsstatus-Anzeige; Storno-Ablauf; Druckansicht (+7 weitere) |
| Verkauf/Freigabe/Übergabe (3) | `/app/home/history`, `/app/home/sale`, `/transfer/[token]` | `EHSensitiveServicePage` | Bewertungs-/Maklertreffer-Darstellung; Freigabe-/Widerruf-Quittung; Übergabelink-Lebenszyklus; Eigentümerwechsel-Prozess; Wartung-Erledigen-Button aus Historie; Druckansicht der Historie (+4 weitere) |
| Hausprofil/Technik/Wartung (4) | `/app/home`, `/app/profile`, `/app/settings`, `/app/year` | `EHOwnerPage`, `EHSettingsPage` | Hausprofil-Bearbeitung mit Validierung; Technik-Hinzufügen; Wartung-Erledigen mit Nachweis; Jahresplan-Ansicht; Historie mit Kosten/Garantie/Dateien; Validierungs-Fehlermeldungen (statisch nicht belegt) (+8 weitere) |
| Druck/Export (1) | `/app/home/passport` | — | Druck-CSS mit Seitenumbrüchen; Druck-Hierarchie mit Original-Logo; Fachhinweise für Ausdruck; Druck-CSS mit Seitenumbrüchen (statisch nicht belegt); Freigabe-/Übergabe-Hinweis im Pass |
| Auftrag/Angebot (5) | `/app/jobs/[id]`, `/app/jobs`, `/pro/jobs/[id]`, `/pro/leads`, `/pro/orders` | `EHJobDetailPage` | Angebot-Schreiben je Rolle (Gegenrolle prüfen); Disposition/Zuweisung (Owner-seitig); Start/Abschluss-Bestätigung je Rolle; Storno-Variante je Rolle; Reklamations-Verlauf nach Einreichung; Disposition/Zuweisung Owner-seitig (nur Pro-Route) (+11 weitere) |
| Posteingang/Updates/Partner (5) | `/app/messages`, `/app/partners/[id]`, `/app/partners`, `/notifications`, `/pro/messages` | — | Gesprächsliste mit ungelesen/gelesen; Thread-Verlaufsansicht; Pagination/Suche im Verlauf; Partnerprofil-Vollständigkeit je Rolle; Thread-Verlaufsansicht (kein Nachrichtenverlauf belegt); Lesebestätigungs-Anzeige (nur unreadCount-Prop) (+5 weitere) |
| App-Rahmen/Zugang (7) | `/app/more`, `/app`, `/check-email`, `/mein-haus`, `/pro`, `/role`, `/welcome` | — | Rollen-Shell/Navigation als EH-Komposition fehlt (nur AppShell-Produktcode, kein Rezept); Betrieb-/Verifizierung-/Vertrag-Prozess fehlt; Fachmaske (reine Navigation); Status-Übersicht als Rezept (keine EH-Komposition); Erneut-senden-Aktion; Weiterleitungs-Bedingung fehlt (immer aktiv) (+3 weitere) |
| Tarif/Verifizierung/Auszahlung (3) | `/app/plans`, `/pro/plans`, `/pro/profile` | `EHPricingPage`, `EHSettingsPage` | Tarifstatus-Anzeige und Wechsel-Ablauf; Zahlungsbestätigung/nicht-verfügbar-Zustand; Nachweis-Upload mit Prüfstatus; Partnervertrags-Ansicht; Stripe-Onboarding-/Auszahlungsstatus; Wechsel-/Kündigungs-Ablauf (+5 weitere) |

## 2. Routen-Tabelle

| Route | Datei | Rolle | Shell | Rezepte | Fehlende Muster (Anzahl) |
|---|---|---|---|---|---|
| `/admin/crm` | `src/app/admin/crm/page.tsx` | admin | Layout ohne explizite Shell-Komponente | — | 8 |
| `/admin/login` | `src/app/admin/login/page.tsx` | admin | Layout ohne explizite Shell-Komponente | `EHAccessPage` | 3 |
| `/admin/ops` | `src/app/admin/ops/page.tsx` | admin | Layout ohne explizite Shell-Komponente | — | 7 |
| `/admin` | `src/app/admin/page.tsx` | admin | Layout ohne explizite Shell-Komponente | — | 7 |
| `/anfrage/[id]` | `src/app/anfrage/[id]/page.tsx` | public/gemischt (Berechtigung ungeprüft) | Layout ohne explizite Shell-Komponente | — | 7 |
| `/anfrage/neu` | `src/app/anfrage/neu/page.tsx` | public/gemischt (Berechtigung ungeprüft) | Layout ohne explizite Shell-Komponente | — | 7 |
| `/anfragen-pro` | `src/app/anfragen-pro/page.tsx` | public/gemischt (Berechtigung ungeprüft) | Layout ohne explizite Shell-Komponente | — | 7 |
| `/app/calendar` | `src/app/app/calendar/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/calendar" title="Kalender" sub | `EHAppointmentsPage` | 6 |
| `/app/consultation` | `src/app/app/consultation/page.tsx` | homeowner | AppShell (role="homeowner" active="/app" title="Beratung" subtitle="Er | — | 8 |
| `/app/documents/[jobId]/receipt` | `src/app/app/documents/[jobId]/receipt/page.tsx` | homeowner | Layout ohne explizite Shell-Komponente | — | 8 |
| `/app/documents` | `src/app/app/documents/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/documents") | — | 7 |
| `/app/emergency` | `src/app/app/emergency/page.tsx` | homeowner | AppShell (role="homeowner" active="/app" title="Notfall" subtitle="Sch | `EHSensitiveServicePage` | 9 |
| `/app/hausmeister` | `src/app/app/hausmeister/page.tsx` | homeowner | AppShell (role="homeowner" active="/app" title="Hausmeister" subtitle= | — | 7 |
| `/app/home/history` | `src/app/app/home/history/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/home") | — | 6 |
| `/app/home` | `src/app/app/home/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/home" title="Mein Haus" subtit | `EHOwnerPage` | 8 |
| `/app/home/passport` | `src/app/app/home/passport/page.tsx` | homeowner | Layout ohne explizite Shell-Komponente | — | 5 |
| `/app/home/sale` | `src/app/app/home/sale/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/home") | `EHSensitiveServicePage` | 8 |
| `/app/insurance` | `src/app/app/insurance/page.tsx` | homeowner | AppShell (role="homeowner" active="/app" title="Versicherungsunterstüt | `EHSensitiveServicePage` | 9 |
| `/app/invoices/[id]` | `src/app/app/invoices/[id]/page.tsx` | homeowner | Layout ohne explizite Shell-Komponente | `EHBillingPage` | 10 |
| `/app/jobs/[id]` | `src/app/app/jobs/[id]/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/jobs" title="Ansprechpartner"  | `EHJobDetailPage` | 8 |
| `/app/jobs` | `src/app/app/jobs/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/jobs" title="Meine Aufträge" s | — | 7 |
| `/app/messages` | `src/app/app/messages/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/messages" title="Ansprechpartn | — | 7 |
| `/app/more` | `src/app/app/more/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/more" title="Mehr" subtitle="A | — | 3 |
| `/app/onboarding` | `src/app/app/onboarding/page.tsx` | homeowner | AppShell (role="homeowner" active="/app" title="Einrichtung" subtitle= | — | 6 |
| `/app` | `src/app/app/page.tsx` | homeowner | AppShell (role="homeowner" active="/app" title="Mein Zuhause" subtitle | — | 3 |
| `/app/partners/[id]` | `src/app/app/partners/[id]/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/jobs" title="Partnerprofil" su | — | 6 |
| `/app/partners` | `src/app/app/partners/page.tsx` | homeowner | Layout ohne explizite Shell-Komponente | — | 5 |
| `/app/plans` | `src/app/app/plans/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/plans") | `EHPricingPage` | 7 |
| `/app/profile` | `src/app/app/profile/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/profile" title="Profil" subtit | `EHSettingsPage` | 7 |
| `/app/settings` | `src/app/app/settings/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/profile" title="App-Einstellun | `EHSettingsPage` | 7 |
| `/app/year` | `src/app/app/year/page.tsx` | homeowner | AppShell (role="homeowner" active="/app/home" title="Mein Jahr" subtit | — | 7 |
| `/chat/[anfrageId]` | `src/app/chat/[anfrageId]/page.tsx` | public/gemischt (Berechtigung ungeprüft) | Layout ohne explizite Shell-Komponente | — | 8 |
| `/check-email` | `src/app/check-email/page.tsx` | public (Auth-/Registrierungsfluss) | Layout ohne explizite Shell-Komponente | — | 3 |
| `/ki-chat` | `src/app/ki-chat/page.tsx` | public/gemischt (Berechtigung ungeprüft) | Layout ohne explizite Shell-Komponente | — | 8 |
| `/login` | `src/app/login/page.tsx` | public (Auth-/Registrierungsfluss) | AuthShell (auth-v2, Tiefe 2: LoginForm/RegisterForm/LegalModal) | `EHAccessPage` | 4 |
| `/mein-haus` | `src/app/mein-haus/page.tsx` | ungeprüft | Layout ohne explizite Shell-Komponente | — | 3 |
| `/notifications` | `src/app/notifications/page.tsx` | rollenübergreifend (u.role dynamisch) | AppShell (role={u.role} active={u.role === 'provider' ? '/notification | — | 6 |
| `/onboarding/pro/[schritt]` | `src/app/onboarding/pro/[schritt]/page.tsx` | partner (Onboarding/Registrierung, Abschluss ungeprüft) | Layout ohne explizite Shell-Komponente | — | 6 |
| `/onboarding/pro/gebiet` | `src/app/onboarding/pro/gebiet/page.tsx` | partner (Onboarding/Registrierung, Abschluss ungeprüft) | Layout ohne explizite Shell-Komponente | — | 6 |
| `/onboarding/pro` | `src/app/onboarding/pro/page.tsx` | partner (Onboarding/Registrierung, Abschluss ungeprüft) | Layout ohne explizite Shell-Komponente | — | 6 |
| `/partner-invite/[token]` | `src/app/partner-invite/[token]/page.tsx` | token-eingeladen (Rolle erst nach Token-Prüfung) | Layout ohne explizite Shell-Komponente | — | 6 |
| `/pro/calendar` | `src/app/pro/calendar/page.tsx` | partner | AppShell (role="provider" active="/pro/calendar" title="Termine" subti | `EHAppointmentsPage` | 5 |
| `/pro/invoices/[id]` | `src/app/pro/invoices/[id]/page.tsx` | partner | Layout ohne explizite Shell-Komponente | `EHBillingPage` | 9 |
| `/pro/jobs/[id]` | `src/app/pro/jobs/[id]/page.tsx` | partner | AppShell (role="provider"
      active={isAccepted ? '/pro/orders' : ' | `EHJobDetailPage` | 9 |
| `/pro/leads` | `src/app/pro/leads/page.tsx` | partner | AppShell (role="provider" active="/pro" title="Immobilien-Leads" subti | — | 7 |
| `/pro/messages` | `src/app/pro/messages/page.tsx` | partner | AppShell (role="provider" active="/pro/messages" title="Nachrichten" s | — | 6 |
| `/pro/onboarding` | `src/app/pro/onboarding/page.tsx` | partner | AppShell (role="provider" active="/pro" title="Einrichtung") | — | 7 |
| `/pro/orders` | `src/app/pro/orders/page.tsx` | partner | AppShell (role="provider" active="/pro/orders" title="Aufträge" subtit | — | 7 |
| `/pro` | `src/app/pro/page.tsx` | partner | AppShell (role="provider" active="/pro" title="Partnerbereich" subtitl | — | 3 |
| `/pro/plans` | `src/app/pro/plans/page.tsx` | partner | AppShell (role="provider" active="/pro/profile" title="Partner-Tarife" | `EHPricingPage` | 8 |
| `/pro/profile` | `src/app/pro/profile/page.tsx` | partner | AppShell (role="provider" active="/pro/profile" title="Profil & Vertra | `EHSettingsPage` | 8 |
| `/pro/team` | `src/app/pro/team/page.tsx` | partner | AppShell (role="provider" active="/pro/team" title="Team" subtitle={ct | — | 7 |
| `/register-owner` | `src/app/register-owner/page.tsx` | public (Auth-/Registrierungsfluss) | Layout ohne explizite Shell-Komponente | `EHAccessPage` | 6 |
| `/register-pro` | `src/app/register-pro/page.tsx` | partner (Onboarding/Registrierung, Abschluss ungeprüft) | Layout ohne explizite Shell-Komponente | `EHAccessPage` | 6 |
| `/register` | `src/app/register/page.tsx` | public (Auth-/Registrierungsfluss) | AuthShell (auth-v2, Tiefe 2: LoginForm/RegisterForm/LegalModal) | `EHAccessPage` | 5 |
| `/role` | `src/app/role/page.tsx` | public (Auth-/Registrierungsfluss) | Layout ohne explizite Shell-Komponente | — | 3 |
| `/transfer/[token]` | `src/app/transfer/[token]/page.tsx` | token-eingeladen (Rolle erst nach Token-Prüfung) | Layout ohne explizite Shell-Komponente | — | 6 |
| `/welcome` | `src/app/welcome/page.tsx` | public (Auth-/Registrierungsfluss) | Layout ohne explizite Shell-Komponente | — | 3 |

## 3. Harte Nicht-Befunde (nichts erfunden)

- `EH*`-Komponenten sind in keiner der 58 Produktseiten importiert (0 Treffer). Rezepte liegen nur im Atelier-Paket, nicht im Produkt.
- Kein `@media print` / `window.print` in Passport/Beleg (nur statischer Druck-Hinweis im Pass; CSS-Regel ungeprüft).
- `/anfrage/neu`: Foto-Anhänge sind Platzhalter (`Foto N`), keine echten Uploads.
- `/anfrage/[id]`: Fallback-Werte `bewertung: 4.8`, `entfernung: 12` statisch belegt (Herkunft ungeprüft).
- Zwei parallele Onboarding-Flows: alter Client-Wizard (`/onboarding/pro*`, useState) + neuer Server-Wizard (`/pro/onboarding`, saveWizardStepAction).
- `/mein-haus` → `/app/home` und `/app/partners` → `/app/messages`: unbedingte Weiterleitungen (keine Bedingung).
- `/app/documents`: kein Upload-Formular belegt (Inventar-`uploads:3` statisch nicht bestätigt → ungeprüft). Uploads belegt in `/app/consultation` (photo), `/pro/profile` (document/logo), `/app/home/history` (3 Datei-Inputs, Fortschritt/Fehler jeweils ungeprüft).
- Dialoge: nur `LegalModal` (Auth) belegt; keine Bestätigungs-/Lösch-/Storno-Dialoge auf Fachrouten.
- Mobile Unterschiede: keine expliziten Mobile-Branches (`useMediaQuery`/`isMobile` 0 Treffer auf Routen); nur responsive Klassen (ungeprüft).
- Auth: Rollenbindung via `AppShell role=` (31 Seiten) + Layouts + Proxy-Cookie-Gate (`/app/*`, `/pro/*`); `requireUser('homeowner')` nur im Pass; keine `requireRole`-Aufrufe auf Routen.

## 4. Getrennte Inventare
CRM-/Hub-/Marketing-Repos brauchen eigene Inventare in ihren Repos. Kein privater Fremdcode hierher kopiert.

## 5. JSON
`app-coverage-report.json`: `{"meta": {...}, "routes": [...]}` je Route `{route,file,role,shell,evidence,sections,fields,actions,states,existingRecipes,belegte_Muster,missingPatterns,unverified}`. Jede Feststellung mit Dateipfad + Symbol/Bedingung.

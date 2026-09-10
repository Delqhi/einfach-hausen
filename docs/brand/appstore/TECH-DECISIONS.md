# EH App Store / iOS — Technische Entscheidungen (Vorlage)

Stand: 2026-09-10 · Basis: `origin/main @ 0503da3` · Worktree
`/home/ubuntu/orca/workspaces/eh-appstore-20260910`, Branch
`feat/eh-appstore-ios-20260910` · Autor: iOS-Gerüst-Agent (OCI sin-supabase).

DESIGN.md + `packages/eh-design` (Tokens `--eh-*`) bleiben bindend —
kein Rebranding, keine neue visuelle Sprache im nativen Gerüst.

## 0. Verifizierter Ausgangsbefund (origin/main)

| Fakt | Beleg |
|---|---|
| `capacitor.config.ts`: `appId de.einfachhausen.app`, `webDir out` | Datei im Repo |
| KEIN `ios/`-Ordner | `ls` negativ |
| `@capacitor/keyboard`, `@capacitor/status-bar`, `@capacitor/cli` vorhanden, aber **KEIN `@capacitor/core` und KEIN `@capacitor/ios`** — obwohl `src/components/NativeInit.tsx` (`@capacitor/core`) + StatusBar/Keyboard-Brücken bereits importiert und im Layout verdrahtet sind | `package.json` + `NativeInit.tsx` |
| KEIN statischer Export: `next.config.ts` enthält kein `output: 'export'` | `next.config.ts` |
| Server-lastig: dutzende `use server`-Actions, `better-sqlite3` (`serverExternalPackages`), Stripe-Connect/Webhook-Routen, Supabase-Server-Auth | `src/`-Grep |
| PWA: Routen-Manifest `src/app/manifest.ts` (`/manifest.webmanifest`), Icons `public/icons/` (192/512/maskable + `apple-touch-icon.png` 180), `sw.js`; Login rein E-Mail-basiert (`AuthShell`), **kein Google-/OAuth-Login im Code** | `manifest.ts`, `layout.tsx`, Login-Page |

Korrektur zur Vorab-Annahme: kein statisches `public/manifest.webmanifest`-File
(Route statt File) und `@capacitor/core` wird benutzt, aber nicht deklariert
(Scaffold fixt das explizit).

## A. Statischer Export vs. gehostete WebView — EMPFEHLUNG: gehostete WebView (v1)

**Reiner `output: 'export'` ist mit dem heutigen Stand technisch nicht machbar:**
Server Actions (Onboarding, Admin/CRM, Zahlungen, Notifications), `better-sqlite3`,
Stripe-Connect/Webhook-Routen und der Supabase-Server-Auth-Pfad lassen sich nicht
in statisches HTML exportieren. Ein Export würde die App auf eine
Marketing-Hülle reduzieren — das ist zugleich das Apple-Risiko.

**Apple Guideline 4.2 (Minimum Functionality):** Eine reine Website-Verpackung
wird abgelehnt. Deshalb v1 als **gehostete WebView** (`server.url` auf die
Produktions-URL, kein `out`-Build nötig) **plus definiertem nativem Mehrwert:**

1. Push-Benachrichtigungen (Hausmeister-Status, Job-/Anfrage-Updates) — `@capacitor/push-notifications` + APNs-Key (Apple-Developer-Aktion, Mac-seitig).
2. Kamera-Upload für Schadenfotos — `@capacitor/camera` (Berechtigungstexte `NSCameraUsageDescription` in `Info.plist`).
3. Offline-Entwürfe/Queue für Anfragen bei Funklöchern (kleiner nativer Speicher + Sync).
4. Bereits vorhanden: StatusBar-/Keyboard-Anpassung (`NativeInit.tsx`).
5. Optional v2: Face-ID-Login, Share-Sheet, Geofencing für Notfall-Handwerker.

`capacitor.config.ts` behält `webDir: "out"` als Ziel für einen späteren
Export-Pfad (z. B. separater statischer Marketing-Subset); v1 nutzt die
`server.url`-Strategie (siehe Scaffold-Kommentar in der Datei).

## B. Auth im WebView — EMPFEHLUNG: Supabase-Cookie-Session über Produktions-URL

- Die App authentifiziert per Supabase-Browser-Client + HttpOnly-Cookies
  (`@supabase/ssr`-Muster). In `WKWebView` funktioniert das, sobald die
  WebView-Adresse die **echte https-Produktions-URL** ist (kein `localhost`,
  keine `file://`): Cookie-Domain/SameSite stimmen, kein Extra-Token-Bridge nötig.
- **Keine Apple-SSO-Pflicht heute:** Es gibt keinen Google-/Facebook-Login im Code
  (T-0206 B7 greift erst, wenn ein Drittanbieter-Login hinzukommt). Falls später
  Google-Login kommt, gleichzeitig `Sign in with Apple` (Supabase Apple-Provider
  + Capacitor-OAuth-Bridge) einplanen — sonst App-Store-Ablehnung nach 4.8.
- Zu prüfen auf dem Mac (Befund offen): `AuthContext`-Fallback-Pfade mit
  `mh_session`/SQLite dürfen in der WebView-Produktion nie greifen (fail-closed,
  T-0168-Regel).

## C. IAP vs. Stripe — EMPFEHLUNG: Hybrid, kein Umbau v1

- Stripe (Connect/Webhooks/Auszahlungen an Handwerker) bleibt Web-/Server-seitig.
- Apple verlangt IAP für **in der App gekaufte digitale Inhalte/Features**.
  Solange die App Companion-Charakter hat (Anfragen stellen, Hausakte, Nachrichten;
  Bezahlung der Handwerkerleistung außerhalb bzw. als reale Dienstleistung),
  bleibt Stripe zulässig. Sobald Premium-Features **in der App** verkauft werden,
  IAP-Produkte (`@capacitor/in-app-purchases`) einführen.
- Offene Klärung (Gina/Jerry, kein Code): Welche kostenpflichtigen Aktionen löst
  der Kunde künftig per Tap in der App aus? Antwort bestimmt IAP-Umfang.

## Scaffold-Status (OCI, ohne Xcode möglich)

- [x] `@capacitor/core` + `@capacitor/ios` (v8, passend zu keyboard/status-bar/cli) installiert
- [x] `npx cap add ios` ausgeführt → `ios/`-Projekt im Branch (nur Gerüst, kein Build)
- [x] `npx cap sync` versucht (Ergebnis siehe Commit-Message/Protokoll)
- [x] Icon-/Splash-Quellen: `public/icons/*` + `assets/appstore/`-Platzhalter dokumentiert
- [ ] `out`-Export NICHT gebaut (bewusst: Server-Architektur, siehe A)

## Was auf einem Mac mit Xcode zu tun bleibt (OCI-unmöglich)

1. `open ios/App/App.xcworkspace` (nie `.xcodeproj`), Xcode aktuell.
2. Signing: Team wählen, Bundle-ID `de.einfachhausen.app` prüfen, Capabilities (Push, Camera) aktivieren.
3. `Info.plist`: `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription` (deutsche Texte), `NSFaceIDUsageDescription` falls v2.
4. Icons/Splash finalisieren: 1024-px-Quelle aus `public/icons/icon-512.png` (oder Logo-Vektor) erzeugen, `@capacitor/assets` laufen lassen.
5. APNs-Key (.p8) erzeugen, Push-Plugin + Server-Versand verdrahten.
6. Product → Archive → Distribute → App Store Connect (neuer App-Record, Screenshots 6,9"/6,7"/iPad, Privacy-Nutrition-Labels, Review-Notiz zu nativem Mehrwert aus A).
7. TestFlight-Build + interner Test, dann Review-Einreichung.
8. Keine App-Store-Connect-Mutationen ohne Freigabe (Verbot respektiert).

## Lücken / Risiken

- `@capacitor/core` fehlte in `package.json` (implizit aufgelöst) — Scaffold fixt.
- `server.url`-WebView braucht Produktions-CSP-/Frame-Freigabe (`frame-ancestors` ist `DENY`; WKWebView mit direkter URL ist kein iframe — OK, aber verifizieren).
- IAP-Umfang hängt an Produktentscheidung (siehe C).
- Kein Xcode/kein Apple-Developer-Zugang auf OCI — Archiv/TestFlight ausschließlich Mac.

## Scaffold-Protokoll (OCI 2026-09-10, ohne Xcode)

- `npm install` OK (767 Pakete).
- `npm i -S @capacitor/core@^8 @capacitor/ios@^8` OK (fixt fehlende Core-Deklaration aus Befund 0).
- `npx cap add ios` OK → `ios/`-Xcode-Projekt im Branch (Geruest, kein Build moeglich ohne Xcode).
- `npx cap sync` → erwartet gestoppt: `Could not find the web assets directory: ./out`
  (kein statischer Export — bestaetigt Entscheidung A: v1 = gehostete WebView via `server.url`).
- `capacitor.config.ts` dokumentiert die `server.url`-Strategie (einkommentieren auf Mac-Seite).
- Commit + Push auf `feat/eh-appstore-ios-20260910` (kein Force, kein /srv-Kontakt).

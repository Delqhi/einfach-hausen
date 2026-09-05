# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.
Format angelehnt an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

## [Unreleased]

### Added
- **Lexikon / Enterprise-Redesign (`feat/lexikon-enterprise-redesign`):**
  `/lexikon` ist jetzt ein Explorer (Hero mit Wort-Stagger und Parallax-
  Kartenstapel, Suche mit `/`-Shortcut und Synonym-Treffern, Sticky-Register
  aus 7 Bereichen + A–Z, Layout-animiertes Raster, Bereichs-Bento).
  `/lexikon/[begriff]` ist ein Entscheidungs-Archetyp: Lesefortschritt,
  sticky „Auf einen Blick“-Panel (Kennzahlen, Orientierungs-Gauges, Wann
  handeln), Scroll-Spy-TOC, gescrubbte Ablauf-Timeline, abhakbare Prüfpunkte
  mit Anliegen-CTA, verwandte Begriffe und Vor/Zurück-Navigator.
- **Neue Routen:** `/lexikon/kategorie/[kategorie]` (7 Bereiche) und eine
  Lexikon-eigene 404 (`src/app/lexikon/not-found.tsx`).
- **Inhalt:** 14 neue Begriffe (Energieausweis, Wärmepumpe, JAZ, U-Wert,
  Taupunkt, FI-Schutzschalter, E-Check, Legionellenprüfung, Rückstauklappe,
  Dachinspektion, Feuerstättenschau, Verkehrssicherungspflicht, Hausakte,
  Instandhaltungsrücklage) in `src/lib/lexikon.ts` mit Relevanz, Stufen,
  Kennzahlen, Synonymen und geprüften Verknüpfungen (`assertLexikonIntegrity`).
- **SEO:** Sitemap um Kategorien/Begriffe erweitert; JSON-LD `DefinedTermSet`,
  `DefinedTerm` (Article `about`) und `ItemList`.
- **Docs:** `docs/LEXIKON.md` (Architektur, Content-Modell, Motion-Inventar,
  A11y, Verifikationsliste); `docs/NEXT_AGENT.md` mit Kontinuationspunkt.

### Changed
- Lexikon-Motion nutzt zusätzlich `motion/react` (bereits Dependency) für
  Layout-/Zustandsanimationen; GSAP-Reveals bleiben. `reducedMotion="user"`.

### Fixed
- **Auth / Deep-Links:** `/login` wertet den vom Auth-Gate (`src/proxy.ts`)
  gesetzten `?next=`-Parameter jetzt aus. Vorher landete jeder Login stur auf
  `/app`, geschützte Deep-Links (z. B. `/pro/anfragen`) gingen verloren. Der
  Wert wird über `safeNextPath()` gegen Open-Redirects abgesichert.
- **Auth / Local-Mode:** `getLocalUser()` las hartkodiert `mh_session`,
  während `createSession()` über `cookieName()` schrieb. Bei gesetztem
  `SESSION_COOKIE_NAME` war man im Local-Mode dauerhaft ausgeloggt.
- **Auth / `/api/auth/local-login`:** setzte einen eigenen Cookie ohne
  Ablaufdatum, ohne Session-Rotation in einer Transaktion und ohne Rate-Limit.
  Nutzt jetzt `createSession()` und das `login`-Rate-Limit.
- **Rate-Limit:** `applyRateLimitLockout()` verglich einen ISO-Zeitstempel
  (`…T…Z`) per String-Vergleich mit SQLites `CURRENT_TIMESTAMP`
  (`YYYY-MM-DD HH:MM:SS`). Auf demselben Kalendertag war die Bedingung nie
  wahr, ein abgelaufener Lockout wurde dort nie erneuert. Vergleich jetzt ISO
  gegen ISO.
- **Proxy / Observability:** eingehende `x-correlation-id`-Header werden auf
  ein sicheres Token-Format validiert (Log-Injection über frei wählbare Header
  ausgeschlossen); der Redirect zum Login trägt die Correlation-ID ebenfalls.
- **`package.json`:** sieben `test:*`-Skripte (`test:observability`,
  `test:slo`, `test:backup-drill`, `test:error-tracking`,
  `test:health-regression`, `test:export-regression`,
  `test:deletion-regression`) lagen versehentlich außerhalb von `scripts` und
  waren per `npm run` nicht aufrufbar. `test:fixtures` nutzte zsh-only
  `setopt NULL_GLOB` und schlug unter npms `sh` fehl. Neues Skript `typecheck`.
- **`/api/konto-loeschen`:** Fehler beim Löschen werden jetzt strukturiert
  geloggt statt stillschweigend verschluckt (Client-Antwort unverändert).

### Removed
- Versehentlich committete Ad-hoc-Skripte `.tmp-b2onb.mjs`, `.tmp-b2shot.mjs`,
  `.tmp-drawer.mjs` sowie die leere `einfach-hausen.db` im Repo-Root.
  `.gitignore` deckt diese Muster jetzt ab.

### Docs
- `docs/AUTH_GATE.md` beschreibt das reale zweistufige Gate (`src/proxy.ts` +
  `requireUser()`); die Aussage „kein zentrales Gate“ war veraltet.

### Chore
- ESLint-Warnungen in `src/` bereinigt (ungenutzte Imports/Parameter,
  überflüssige `eslint-disable`-Direktive). `npx eslint src` ist warnungsfrei.

# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.
Format angelehnt an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

## [Unreleased]

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

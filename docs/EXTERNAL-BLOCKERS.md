# Externe Blocker — verifizierte Fakten

Stand: 2026-09-04 (T-0131 Convergence done, main `13496d7`)

Technischer Abschluss (Wellen A-E, T-0129/T-0130/T-0131, Supabase-, Demo-, GSC-, Blog/Lexikon-Stände) ist durch diese Liste
nicht blockiert. Die folgenden Punkte sind externe Betriebs-/Rechts-Faktoren, die
der technische Abschluss weder erfinden noch erledigen kann:

1. **Domain/DNS-Härtung (STRATO DNSSEC)** — geerbt aus früheren akzeptierten
   Übergaben (Issue-Referenz #16). In dieser Welle nicht neu verifiziert; vor
   scharfer DNS-Umstellung vom Domain-Verantwortlichen zu prüfen.
2. **Rechtstexte (Impressum/Datenschutz/AGB final freigegeben)** — geerbt (#11).
   Die App liefert Platzhalter-konforme Rechtstexte-Seiten aus; eine juristische
   Freigabe ist extern.
3. **Zahlungen live schalten (SEPA/Stripe)** — geerbt (#14). Stripe-Integration
   ist im Code vorhanden (Webhook/Connect-Routen), der scharfe Live-Betrieb mit
   echten Lastschriften ist eine externe Geschäftsfreigabe.
4. **Offsite-Backup-Ziel (T-0204)** — die verifizierte Nächtlich-Sicherung liegt
   same-host im Supabase-Bucket. Eine Zweitkopie außerhalb der VM (z. B. OCI
   Object Storage) braucht eine Tenancy-Entscheidung/Credentials des
   Betreibers; OCI-CLI ist installiert, aber unkonfiguriert.
5. **E-Mail-Postfach-Nachweis (T-0201)** — SMTP-Versand ist live verifiziert
   (Handshake + selbst adressierter Sende-Nachweis via Resend). Der Empfang in
   einem echten Postfach (z. B. Antwort-Handling) benötigt ein betreibereitens
   gepflegtes Postfach und ist deshalb nicht agentenseitig beweisbar.

6. **GitHub Actions fuer dieses private Repo nicht nutzbar (T-0157, 2026-08-31 verifiziert)** —
   alle 90 letzten Runs `startup_failure` mit 0 Jobs (Actions-Minuten/Plan-Sache des Accounts).
   Der einheitliche Release-Gate greift deshalb repo-seitig als Pflichtschritt in
   `deploy/update-on-oci.sh`; `quality.yml` ist vorbereitet (inkl. Supabase-Secrets) und
   startet automatisch, sobald Actions aktiviert ist.

7. **Geteilter Supabase-Gateway: fremde Projekte können Auth-User löschen (2026-09-01 verifiziert)** —
   `auth.users` wurde von `service_role` mit Referer `shopsin.delqhi.com` vollständig geleert (Logs
   `supabase-auth`: `user_deleted` x N, actor `service_role`). Die Demo-/Test-Identities von
   einfach-hausen waren dadurch weg; Benutzer-Logins am geteilten Gateway sind strukturell nicht
   gegen fremde Projekte geschützt, solange Projekte dieselbe Instanz/Keys teilen. Betreiber-
   Entscheidung nötig: eigenes Supabase-Projekt/Keys für einfach-hausen (empfohlen) oder
   Aufteilung der admin-Rechte. Demo-Logins wurden 2026-09-01 neu erstellt (Passwörter wie
   zuvor, auth_subject neu gebunden).

Nicht-Blocker, aber grenzwertig erwähnt: App-Store-Auslieferung (Capacitor) ist
Teil historischer Planung (T-0167, nie ausgeführt) und nicht Teil des aktuellen
Taskplans.

Pflege-Regel: Nur verifizierte Fakten eintragen. Technische Abschlusswellen
autorisiert keine Legal-/Business-Fakten.
8. **Google/Apple-SSO in den App-Registrierungen (T-0206 B7)** — die
   Notion-Referenz zeigt „Mit Google/Apple anmelden"-Buttons. Echte
   OAuth-Credentials (Google Cloud + Apple Developer, verifyte Domains) sind
   Betriebervollmacht; Fake-Buttons ohne funktionierendes Backend sind
   verboten. Erst nach Credential-Bereitstellung umsetzbar.

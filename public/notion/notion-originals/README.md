# Notion original reference images (authoritative)

Recovered 2026-08-29 on the Mac-M1 host from the live owner Notion page
"App Design" (https://app.notion.com/p/App-Design-3c8b784cdffc80a1a5d1ed2269dbdd0d)
using the operator's authenticated session (vibe-notion + browser fetch of the
`app.notion.com/image/attachment:...` sources).

These are the ORIGINAL embedded Notion image files, not browser re-captures.

- Block captions and order: MANIFEST.block-order.json
- Checksums: SHA256SUMS.txt
- Full-page render for section context: .sin-gpt-web evidence dir
  (.sin-gpt-web/evidence/T-0169/oci/notion-page-full.png), not part of the app bundle.

Owner (Eigenheimbesitzer) references:

- LogIn_oder_Neu.png          -> Einstieg / First Screen (Log in / Neues Konto)
- eigentumer.login.png        -> owner auth screen (caption "eigentümer.login.png";
                                 content: Konto erstellen + Google/Apple + "Schon ein Konto? Anmelden")
- kontoerstellung.eigentumer.png -> multi-step Kontoerstellung (Profil/Haus/Verifizierung/Fertig)
- first_action.png            -> role selection ("Ich bin Eigentümer" / "Ich bin Dienstleister")
- Homesceen_EH_02.png         -> Owner Dashboard (Homescreen)
- Menuepunkte_01.png          -> Menü geschlossen (drawer, no accordion expanded)
- menuepunkte_offen.png       -> Menü geöffnet (drawer, numbered accordion sections expanded)

Provider (Dienstleister) references:

- Dienstleister.login.png
- Homesceen.dienstleister.png
- menueleiste_dienstleister.png
- geoeffnetes_menue_dienstleister.png
- firmendaten_und_leistungen_handwerker.png

Verified ABSENCE: the authoritative page contains NO dedicated full-screen
"Haus-Historie" mockup (all 12 embedded images and the full-page render were
inspected on 2026-08-29). Haus-Historie appears only as a dashboard card
("Haus-Historie ansehen", Homesceen_EH_02.png) and as menu section
"4. Haus-Historie" (menuepunkte_offen.png). Per docs/T0168_DEEP_RESEARCH.md §7
the Historie screen is therefore accepted on shared-design-system parity only;
no 1:1 claim is made for it.

The older sibling directory `recovered-browser-captures/` contains historical
1440x783 browser captures of the same page top; all six files there are
pixel-identical views of the page top and are kept for provenance only.

# Verbindliche Kontrastentscheidung · 2026-09-07

Jerry hat die direkte Korrektur von pillTerra und Lexikon-Badges beauftragt. Keine weitere Markenentscheidung erforderlich.

Terra #a84d29 auf Sand #ecdfc9: 4.247678:1, für kleinen normalen Text unzureichend. Text jetzt Ink #10222a auf Sand #ecdfc9: 12.431167:1. Vorhandenes Terra bleibt nur beim SVG-Icon als ergänzendem Akzent (4.247678:1); Bedeutung weiterhin ausgeschrieben. Tokens unverändert.

Geänderte Selektoren: src/components/marketing/app-frames.module.css .pill/.pillTerra und src/components/marketing/lexikon/lexikon.module.css .badge/.badge[data-tone=pflicht]/.explorer .badge. Textgröße var(--eh-font-label) (15px bei 16px Root). Lexikon min-height statt starrer Höhe; 11px-Override entfernt. Empfohlen/Wissen behalten ihre vorhandenen kontrastreichen Tokenpaare.

Prüfung: rechnerische sRGB-Luminanz der kanonischen Farben, diff --check. Keine Live-CSS-Messung oder visuelle Abnahme behauptet. Lokaler Agent übernimmt diesen eigenständigen main-basierten Commit, prüft die gemeldeten Axe-Fälle samt 390/736/1440px, Zoom und Wrapping und kann danach den Kontrast-Unterpunkt schließen. Keine weiteren Workflows eigenständig designen. Nicht die gesamte Designmigration schließen. Andere offene App-Vorgaben: PR49 und PR51.

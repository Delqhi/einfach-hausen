# App-Komposition neu aufbauen · 2026-09-08

Jerry hat die bisherige Shell/Owner-/Pro-Komposition ausdrücklich gestalterisch zurückgewiesen. Historische technische Gates bleiben Nachweise für Technik, nicht für Produktgestaltung. Basis: 7eabe4a. Branch: design/eh-workspace-20260908. Kein Deployment.

## Implementiert
packages/eh-design/src/workspace.tsx: EHWorkspaceFrame, EHWorkspaceNavItem, EHWorkspaceGrid, EHWorkSection, EHPriorityAction, EHWorkMetrics, EHServiceDirectory, EHRequestList. Stile im kanonischen styles.module.css, vorhandene Markenfarben/Inter/Logo bleiben. Keine neue Palette.
248px Sidebar, bis 1240px tatsächlicher Inhalt, genau eine sichtbare Brand-Zone je Viewport, 22px Navigationsicons, deutlicher Petrol-Aktivzustand, Konto unten. Topbar ist globaler Kontext und Benachrichtigung; Seitenh1 ausschließlich im Inhalt. Mobile bestehende Menü- und BottomNav-Funktionen erhalten.
Owner /app: Entscheidung priorisiert, tatsächlicher Hausmeister-Composer neben nächsten Ereignissen, thematische Servicezugänge. /app/more: alle sieben vorhandenen Ziele mit ursprünglichen Icons in Haus/Konto gruppiert. Keine Mitgliedschaft oder Zustände erfunden.
Pro /pro: große Arbeitskennzahlen, Petrol-Prioritätsaktion, eigenständige Anfragezeilen mit vollständiger Beschreibung, Ort, Zeit, Preis und klarer Aktion; Termine daneben. Vorhandene Datenabfragen und Berechtigungsgrenzen bleiben. Vorschau von zwei Terminen wird nicht als Gesamtanzahl ausgegeben; Anfragezahl als geladene Teilmenge bezeichnet. Behauptung vollständiger Angebotsinformationen entfernt.

## Gestalterische Abnahme: noch NICHT bestanden
Implementierter Kandidat, kein abgeschlossenes Premium-Urteil. TypeScript bestanden. Isolierte Komponenten-Vorschau 390/736/1536: eine h1, ein sichtbares Logo, kein horizontaler Overflow. Desktop-Vorschau gesichtet. Die Vorschau benutzt Beispieldaten und ersetzt keine echte App-Ansicht; nicht als Produktion screenshotten oder als Kundennachweis verwenden. App-Mobile-Menü, Composer, bestehende globale Styles und echte Rollenflüsse wurden dort nicht geprüft.
GitNexus impact versucht für AppShell/Dashboard/More/Pro: Timeouts und defekte npx-Installation; kein aktueller Graphnachweis. AppShell aus vorherigem Index kritisch mit mindestens30 Verbrauchern. Vor Integration umfassend gegen bestehende Seiten prüfen.

## Nächster Agent
1. Aktuellen main und laufende Änderungen dreiwegeintegrieren; keine fremde Arbeit überschreiben. Dieser Branch ersetzt sichtbare Komposition, nicht Backend/Auth/Nav-Ziele.
2. Tatsächliche Owner-/Pro-Konten verwenden. Alle drei geänderten Seiten und repräsentative Shell-Verbraucher (Detail, Formular, Docs, Profil) bei390/736/1536 mit Inter prüfen. Mobile Drawer, BottomNav, Touch, Fokus, Benachrichtigungen und Composer wirklich bedienen. Fehlende Daten, sehr lange Titel und viele Anfragen zeigen.
3. Fehlende Fachkompositionen für Terminagenda, Dokumente, Wartung, Profile, Rechnungen gesondert inventarisieren. Kein EHPanel-für-alles. Keine neuen Funktionen erfinden. Nicht alle App-Seiten als fertig deklarieren.
4. Neue visuelle Baselines erst nach gestalteter Ansicht und Betreiberreview akzeptieren. Qualitätsmatrix muss Hierarchie, Arbeitsbreite, Dichte, Priorität und fachliche Unterschiede explizit bewerten; reine Token-/Overflow-/A11y-Ergebnisse reichen nicht.
5. Erst nach echter integrierter Prüfung normalen Merge-/Releaseprozess durchführen. Keine Guards abschwächen. Vollständige geänderte Dateien: SOURCE.md und source-manifest.json.

Aktueller Design-Check: FEHLGESCHLAGEN wegen bereits in Basis7eabe4a vorhandenen literal-color/unowned-style in src/app/docs-internal/{page.tsx,layout.tsx,[doc]/page.tsx}. Diese Dateien sind im Workspace-Branch unverändert. Nicht Baseline/Guard abschwächen; separate Docs-Korrektur nötig.

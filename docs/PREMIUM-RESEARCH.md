# Premium-App-Recherche (T-0208) — Repos, Patterns, Adoption

**Datum:** 2026-08-31 · **Quellen:** GitHub-API-Suche (gh CLI), bekannte Referenz-Repos. Web-Suche via Serper ist im Prime-Agent nicht konfiguriert (Hinweis hinterlegt); GitHub + Referenzwissen deckt die Patterns.

## Gefundene, relevante Repos (nach Relevanz für unseren Stack sortiert)

| Repo | Stars | Was es kann | Entscheidung für einfach-hausen |
|---|---|---|---|
| emilkowalski/vaul | 8.6k | Drawer/Bottom-Sheet mit Feder-Physik, Drag-to-dismiss, Snap | **Pattern übernommen ohne Dependency**: Drag-to-dismiss + Federn via CSS transition/pointer events im Owner-Drawer (App bleibt klein — unser Architekturprinzip) |
| emilkowalski/sonner | 12.9k | Opinionated Toasts (Stapel, Positionen, Reichtext) | **Eigenes Toast-System** im Design-System-Stil gebaut (`ui-toast()` global API) statt lib — gleiche UX, null Dep |
| shuding/next-view-transitions | 2.4k | View-Transitions-API in Next App Router | **CSS-only Variante übernommen**: `@view-transition{navigation:auto}` + benannte `view-transition-name` auf Topbar-Logo → Seiten wechseln nativ-morphend |
| borabaloglu/vaul-base | 112 | Unstyled Vaul-Variante | nur Referenz |
| swipe-bar (luciodale) | klein | Gesture-Sidebar mit Spring-Physik | Pattern für künftige Filter-Drawers |
| use-pull-to-refresh | 34 | PTR-Hook | **nicht übernommen**: Browser-PTR reicht; doppelt wäre irritierend |
| hemanth/awesome-pwa | 4.9k | PWA-Liste | Referenz geprüft: Offline-Shell + Manifest haben wir bereits |
| Capacitor Haptics | — | Native Haptik | **Web-Variante**: `navigator.vibrate` auf Erfolgsaktionen (Android; iOS ignoriert) — echtes Capacitor erst mit App-Store-Weg (T-0167) |

## Web-/Pattern-Wissen (anwendbar ohne Lib)

- **iOS-Feel-CSS**: `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`, `user-select:none` auf Chrome-Elementen, `overscroll-behavior-y: contain` im App-Shell, Momentum-Scroll, Safe-Area-Insets (haben wir teils).
- **Press-States**: `scale(0.98)` + opacity auf `:active` für alle tappbaren Karten/Buttons — der stärkste Einzelhebel für „fühlt sich app-like an".
- **Skeletons**: Shimmer per CSS (kein JS), in `loading.tsx` je Route.
- **CountUp für Stats**: `@property`-Counter-Animation oder rAF — Zahlen „zählen hoch" beim ersten Render.
- **Bottom-Sheets statt Modals** auf Mobile: `.sheet`-Pattern vorhanden, Übergänge federn.
- **Backdrop-Filter** auf Topbar (haben wir: blur 16px ✓).

## Adoptierte Hebel in dieser Welle (T-0208)
1. View Transitions (A) + Logo-Morph
2. Micro-CSS-Paket (B) — tap-highlight, press-scale, touch-action
3. Toast-System (C) + Einbindung in Settings/AI-Flows
4. Skeletons /pro (D)
5. CountUp Stats (E)
6. Haptics-lite (F)
7. Drawer Drag-to-dismiss (G)

## Bewusst NICHT übernommen (Begründung)
- vaul/sonner/radix als Dependencies (App-Größe, Design-System-Kohärenz, eigene CSS-Pipeline ist schneller)
- Dark-Mode (DESIGN.md: helles Brand)
- Material-Ripples (passt nicht zur ruhigen Design-Sprache)
- Ad-SDK / Purchase-Flow (T-0207: externe Vollmachten, Blocker dokumentiert)

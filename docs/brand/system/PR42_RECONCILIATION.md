# Abgleich PR #42 / verbindliche Konsolidierung

Quelle: feat/eh-brand-04-contract, Commit 4af71494965356655d755885226486d02c0d6d92, Draft PR https://github.com/Delqhi/einfach-hausen/pull/42. Der Branch bleibt erhalten; nichts wurde überschrieben oder zurückgesetzt.

Übernommen als belegte Randbedingungen: Atelier-02-Freigabe, volle Originallogos, Inter, keine Menü-/Backend-/Auth-Neugestaltung, keine erfundenen Geschäftszusagen, keine Wiedereinfügung abgelehnter Website-Videos, öffentliches ungeschütztes main zum Prüfzeitpunkt.

Verbindliche Weiterentwicklung ist PR #41: DESIGN.md, packages/eh-design, 49 ausführbare Komponenten, acht vollständige React-Seitenrezepte, Native-HTML-Adapter für das separate Worker-CRM, installierbarer Skill sin-eh-design und korrigierter sin-frontend-design. src/components/marketing/tokens.css bleibt als kompatible Alias-Schicht erhalten; die einzige Wertquelle ist packages/eh-design/src/tokens.json.

Die R1–R8 in #42 sind Textbeschreibungen, keine acht ausführbaren Komponenten. Der dortige Guard erlaubt zahlreiche Altfarben global und schützt Kerndateien nur durch Existenzchecks. Der neue Guard verwendet begrenzte Altlasten pro Datei, SHA256-Siegel und den vertrauenswürdigen PR-Basisvertrag. Deshalb keine zweite brand-guard.yml / kein zweiter Normtext importieren.

Korrekte CRM-Unterscheidung: /admin/crm im Hauptrepo ist React Server Component. einfachhausen-de/einfach-hausen-crm ist ein separates Cloudflare-Worker-HTML-Projekt. Der native Adapter ist für dieses echte Consumer-Repo, nicht für einen erfundenen HTML-Umbau von /admin/crm.

Die Änderungen an presentation/premium in #42 verbessern einige Farben, enthalten aber weiterhin alte Akzente/Verläufe und einen historischen SVG-Mark-Pfad. Sie wurden nicht als fertige Markenmigration übernommen. Dieses historische Deck gehört in die Folgeprüfung EH-BRAND-06; der tatsächlich aktive separate Präsentationsgenerator wurde vollständig am Renderer-/Token-/Exportkern angepasst.

Letzte Nutzersteuerung: Designbibliothek und Skills fertigstellen; weitere Test-/Regressionsläufe an lokale Agenten übergeben. Bereits erhobene Nachweise bleiben Evidenz, keine Behauptung zusätzlicher Läufe. Pflicht-Check-Aktivierung/Branchschutz und endgültige Merge-Regression sind EH-BRAND-06. Kein Merge und kein Deployment durch diese Lieferung.

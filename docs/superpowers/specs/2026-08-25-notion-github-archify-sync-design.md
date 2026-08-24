# Notion ↔ GitHub ↔ Archify synchronization design

## Goal
Make the Einfach Hausen task system tell the truth with minimum management overhead: Notion is the business-visible source of truth, GitHub is the engineering execution/evidence layer, and Archify is the visual explanation layer.

## Principles
1. Simple beats comprehensive UI. Do not add project-management fields to Notion beyond Aufgabe, Zuständig, Bereich, Status.
2. Only Jerry-owned work enters GitHub. Gina-owned and Gemeinsam-owned tasks remain outside the engineering issue mirror unless explicitly requested later.
3. Evidence before status. A Notion task is `Erledigt` only when current repository/taskplan/test/issue evidence proves the work. Partial or externally blocked work is `In Arbeit`.
4. Do not duplicate work. Existing issues #1–#9, SIN taskplan tasks, commits, reports and current code are reused as evidence. New GitHub issues are created only for genuine remaining Jerry work not already represented.
5. One useful issue may close several business tasks. Closely related Notion tasks may point to the same GitHub issue when they are one technical deliverable. This avoids a 113-issue bureaucracy wall.
6. Completion synchronization is mandatory. An engineering issue is only complete when its finished Jerry Notion tasks are set to `Erledigt` and contain a short completion note with Ergebnis, Nachweis and durable Betriebsinfo.
7. Legal truth stays explicit. Repository-ready legal page structure or draft text is not represented as final legal approval. Missing operator facts, privacy classifications and legal counsel decisions remain explicit external blockers.

## Status mapping
### Erledigt
Use when the implemented capability is on the integrated repository tree and has durable verification evidence (taskplan completion report, focused tests, full E2E, closed issue or accepted gauntlet). Add a concise Notion completion block.

If a related GitHub issue is already closed, the Notion completion block includes Ergebnis, GitHub issue URL, the issue closing/success comment or concise verified equivalent, and durable code/test/ops evidence.

### In Arbeit
Use when substantial implementation already exists but one required local or external gate remains. Include the exact remaining gate. Examples: production smoke, legal approval, live credentials, App Store / Play Store publication.

### Offen
Use when there is no material implementation yet and the task is still a real Jerry responsibility.

## GitHub issue strategy
Do not generate one issue per Notion row. Create a small set of execution issues grouped by deliverable, each carrying the exact mapped Notion task titles.

Every new issue contains this Definition of Done rule:

> Before closing: verify code/docs/tests, then use SIN Notion to update every mapped Jerry task. Set finished tasks to `Erledigt`, keep partial/external-authority tasks `In Arbeit`, and append `Ergebnis`, `Nachweis` (issue/commit/files/tests) and durable `Betriebsinfo`. The issue is not complete until Notion synchronization succeeds or an explicit Notion-service retry blocker is recorded.

Expected remaining issue families:
- Production launch / domain / live integration acceptance
- Legal, privacy and contractual approval packet
- PWA/native store distribution and browser push where actually required
- CRM production recovery and SIN outreach/inbox integration
- Analytics/tracking only after production privacy/consent classification

## Archify documentation set
Use Archify v2.11 only. No Mermaid, PlantUML, ASCII diagrams or hand-authored SVG.

Create focused diagrams rather than one dense overview:
1. `platform-architecture` — architecture: customer/public/PWA, Next.js app, SQLite/private storage, provider/admin, external integrations and OCI/Cloudflare boundary.
2. `homeowner-service-flow` — workflow: question → explicit contact/order choice → matching → quote/book → human contact → house history.
3. `partner-job-lifecycle` — lifecycle: request → quote → accepted → assigned/in progress → invoice → completed/cancelled.
4. `property-privacy-dataflow` — dataflow: homeowner input → property-scoped data → permission/share gate → provider/broker exposure, explicitly isolating private messages/payments/documents.
5. `payment-lifecycle` — lifecycle: Checkout pending → Stripe webhook authority → paid/failed/refunded/cancelled with no browser-success authority.
6. `crm-outreach-flow` — workflow: discovery → dedupe → CRM → permission → queue/claim → contact/reply → follow-up → qualified/converted.
7. `production-recovery-flow` — workflow: GitHub main → pre-deploy backup → Node22 build → systemd → Cloudflare → health, with non-destructive restore branch.

For each diagram keep synchronized:
- `docs/diagrams/<name>.<type>.json`
- `docs/diagrams/<name>.html`
- `docs/diagrams/<name>.svg`

## README/docs placement
- Root README: platform architecture + links to focused visual docs.
- `docs/ARCHITECTURE.md`: platform architecture, homeowner service flow, property/privacy dataflow.
- `docs/PRODUCT_VISION.md`: homeowner service flow and partner lifecycle.
- `docs/OPERATIONS.md`: production/recovery flow.
- `docs/CRM.md`: CRM/outreach flow.
- `einfach-hausen-crm/README.md`: CRM/outreach flow.

No document receives every diagram.

## Notion diagram placement
Only add a diagram reference to a task when it materially explains that task. Keep the task body short.
- Produktarchitektur / App-Architektur / Backend / Datenbank → platform architecture
- Aufträge / Angebote / Kommunikation → homeowner service + partner lifecycle
- Datenschutz / Nutzerrechte / Datenexport / Freigaben → property/privacy dataflow
- Zahlungsintegration / Zahlungsfehler / Rechnungsstatus / Kündigungslogik → payment lifecycle
- Hosting / Backups / Monitoring / Domaintechnik → production/recovery flow
- CRM / Akquise/integration tasks → CRM/outreach flow

## Verification
Before completion claim:
- Archify `doctor` passes on Node 22.
- Every JSON validates and every HTML passes Archify `check`.
- SVGs come from Archify export, not manual reconstruction.
- README/docs links resolve.
- `git diff --check` passes in both repositories.
- Relevant repository lint/build/tests remain green if source/config changed.
- GitHub issues and Notion statuses are re-read after writes.
- No Gina/Gemeinsam row is mutated by Jerry status synchronization.

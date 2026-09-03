# Einfach Hausen CRM

The dedicated acquisition/outreach control plane is the standalone repository `einfach-hausen-crm`, deployed at `https://crm.einfachhausen.de`. It owns the production CRM Worker/API and Cloudflare D1 lifecycle for dedupe, queue claims, contact history, inbox/replies and follow-ups.

The main application still contains `/admin/crm` and its SQLite `crm_leads` model as the original platform-integrated lead/operator surface. During the standalone CRM convergence it is also the canonical source dataset for the first verified D1 backfill. **Do not evolve the two surfaces as competing CRMs.** New outreach-control-plane work belongs in `einfach-hausen-crm`; platform user/provider conversion boundaries remain in this repository.

A researched company or inbound homeowner intentionally sits **before** the operational `users` / `provider_profiles` model: a lead is not a platform user or verified partner.

## Visueller CRM-Flow

![CRM und Outreach](diagrams/crm-outreach-flow.svg)

[Interaktiven CRM-/Outreach-Flow öffnen](diagrams/crm-outreach-flow.html)

## Lead types

- `provider` — trades, caretakers, service companies and other potential partners.
- `homeowner` — identified prospective homeowner customers from inbound, referrals,
  communities or other documented sources.
- `public_intent` — a public project/renovation signal such as an RSS/forum thread;
  it is not treated as marketing consent and is not deanonymized into a private person record.
- `property` — a non-personal property/building opportunity from open data.
- `other` — exceptional manually classified leads.

## Pipeline

`collected -> contact_ready -> contacted -> replied -> qualified -> invited -> converted`

Terminal / negative states: `not_interested`, `invalid`, `do_not_contact`.

Sales status is separate from `contact_permission`:

- `unknown`
- `allowed`
- `consented`
- `denied`
- `do_not_contact`

A public profile, email or phone number is never automatically interpreted as
permission to send marketing. `do_not_contact` is durable and fail-closed.

## SIN-Business-Research import

The canonical discovery database is project-neutral and owned by
`SIN-Business-Research`:

```text
~/.local/share/sin-business-research/leads.sqlite3
```

Import it into the app CRM with:

```bash
python3 scripts/import-business-research.py
```

Override paths when necessary:

```bash
BUSINESS_RESEARCH_DB_PATH=/path/to/leads.sqlite3 \
DATABASE_PATH=/path/to/einfach-hausen.db \
python3 scripts/import-business-research.py
```

The sync is idempotent. It imports all available research tables: `leads`,
`public_intents`, and `property_opportunities`. It refreshes public facts and
provenance while preserving the Einfach-Hausen CRM status, contact permission,
notes and contact history on existing records.

The Admin UI also exposes a sync button when the source DB exists on the same
host. Large first-time production syncs should use the CLI script so they are
not coupled to an HTTP request timeout.

## Owner/community leads

Admin users can manually record homeowner leads from `website`, `referral`,
`facebook_group`, `forum`, `community`, `campaign`, `existing_customer` and
other explicit sources, including the originating profile/community URL.
Public forum/RSS discoveries stay `public_intent` until there is an appropriate
reason to create an identified homeowner lead; the CRM does not infer a private
address, email or real-world identity from a handle.

This repository does **not** automate Facebook/Meta profile scraping, account
harvesting, unsolicited bulk DMs or anti-bot evasion. Community acquisition
should prefer useful group participation, public posts, opt-in landing pages,
referrals and inbound requests. If a person objects, set `do_not_contact`.

## Data boundaries

- CRM leads are not automatically `users`.
- Research leads are not automatically verified partners.
- The embedded `/admin/crm` does not become a second outreach transport layer. Outbound/inbound connector execution belongs to `einfach-hausen-crm` through the shared authenticated SIN connector/runtime paths.
- Contact events/status are tracked independently from discovery provenance.
- `crm_events` remains the main-app audit history for platform-side status/contact/conversion changes; standalone CRM contact/inbox history lives in its D1 lifecycle.
- Runtime SQLite files stay under `data/` and are excluded from Git; standalone CRM production state stays in its configured Cloudflare D1.

## Verification

Main application boundary:

```bash
npm run lint
npm run build
python3 scripts/import-business-research.py --limit 100
```

Standalone outreach CRM boundary (run in `einfach-hausen-crm`):

```bash
npm test
npm run check
npm run cf:dry-run
```

The full Germany lead dataset is runtime data and must not be committed. During the current migration/convergence wave the main-app SQLite CRM dataset is synced idempotently to standalone D1; `contact_permission=unknown` is never promoted to consent by import.

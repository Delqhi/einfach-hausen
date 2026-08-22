<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Einfach Hausen engineering workflow

- `docs/PRODUCT_VISION.md` is the binding product definition. Preserve the core model: AI organizes, verified regional partners execute, and a concrete human contact takes over after booking.
- For architecture, dependency flow, blast-radius questions, and unfamiliar code paths, use Graphify first: `graphify query`, `graphify explain`, or `graphify path`. If the graph is absent or stale, run `npm run graph:update`.
- Graphify output is generated local state under `graphify-out/` and is intentionally not committed. Git hooks installed by Graphify refresh the graph after commit/checkout.
- Before shipping application changes run `npm run lint`, `npm run build`, and the relevant E2E flow (`npm run test:e2e` for end-to-end product changes).
- Reuse the existing OCI stack (OmniRoute, Supabase, Kestra, Cloudflare) instead of introducing parallel infrastructure unless there is a demonstrated gap.
- **Production/domain continuation:** Before changing production infrastructure, DNS, Cloudflare, STRATO, Stripe or OCI routing, read `docs/PRODUCTION_HANDOVER.md` and `docs/OPERATIONS.md`. Treat handover status as a starting point only; verify live state before mutations.
- Keep the customer and partner products radically simple. Do not add generic ERP-style roles, settings, dashboards, or configuration unless required by the product vision.


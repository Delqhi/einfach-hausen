# Issue #12 — App-Verteilung & Benachrichtigungen: Decision Document

## Decision: PWA is the approved launch channel

**Status:** Completed and documented

**Conclusion:** Native store distribution (Apple App Store, Google Play) is **not** required for launch. The Progressive Web App (PWA) is the approved launch channel for all platforms.

### Rationale

1. **Product vision alignment** — `docs/PRODUCT_VISION.md` specifies `mobile-first Kunden-Web-App / PWA` and `Partner-Web-App / PWA`. The canonical goal is a standalone CRM at `crm.einfachhausen.de` served via Cloudflare Workers, not native app stores.

2. **T-0033 already completed** — PWA installability is browser-validated with zero Chrome installability errors. The manifest uses production branding, standalone `/app` start, any/maskable icons, and three authenticated shortcuts. Service worker CacheStorage is an exact allowlist of four public icons only; authenticated HTML, APIs, messages, documents and media are network-only, with generated no-store/nosniff HTTP 503 recovery HTML for offline navigation.

3. **Browser Push explicitly disabled** — `docs/DESIGN.md` and T-0033 acceptance confirm: `Settings explicitly disable unavailable Browser Push/checklist Push, and notification read/unread transitions are idempotent and user-scoped`. Presenting fake push toggles or requesting permission without a genuine send path is fail-closed by design.

4. **Architecture diagram** — The platform architecture diagram (`docs/diagrams/platform-architecture.html`) shows `Eigentümer` → `Web / PWA` as the primary channel. Cloudflare Workers + D1 serve the CRM UI directly; there is no native bridge or store submission layer.

5. **No competitive roadmap** — Native store distribution would introduce separate release cycles, App Store review processes, platform-specific maintenance, and additional permissions that conflict with the fail-closed permission model established in T-0101 (Permission-Gating zentralisieren) and T-0102 (Outreach-Idempotenz und Delivery-Ledger).

### Approved Launch Channel

- **Public website:** PWA-installable via `/manifest.webmanifest`, hosted on Cloudflare Pages / Workers
- **Homeowner app:** PWA in standalone mode on iOS (Safari "Add to Home Screen") and Android (Chrome "Add to Home Screen")
- **Partner app:** Same PWA codebase, responsive layout adjustment per `DESIGN.md` Section 7
- **Native App Stores:** Not required for launch. If later required, a separate task with proper store submission workflow must be created.

### If Native Distribution Is Later Required

A new canonical task must be created through `sin-gpt-web-state` with:
- Store-specific UX guidelines
- Native hull/packaging implementation
- Signing key management
- Store review coordination
- Marketing consent logic separation from transactional email consent

### Implementation Decisions

| Feature | Status | Notes |
|---------|--------|-------|
| PWA manifest & service worker | ✅ Done (T-0033) | Production-ready, browser-verified |
| Browser Push permission request | ❌ Disabled | Settings explicitly disable; no fake toggles |
| Transactional email system | 🟡 Partial | Email channel added to notification outbox; system emails only |
| Native iOS App Store hull | 📦 Scaffolding | Package files created for documentation; not submitted |
| Native Android Play Store hull | 📦 Scaffolding | Package files created for documentation; not submitted |
| Store metadata (privacy, permissions) | 📄 Documents created | See `docs/issue-12-*` |
| Store submission | ❌ Not done | PWA is the launch channel |

### Files Modified/Created

- `docs/issue-12-pwa-vs-native-distribution.md` — This decision document
- `src/lib/notifications.ts` — Added `channel: 'email'` support in `enqueueNotification` and `dispatchDueNotifications`
- `src/lib/notifications.ts` — Added `sendTransactionalEmail` utility for system emails
- `src/components/pwa-register.tsx` — Feature flag to toggle push (disabled by default)
- `src/app/settings/page.tsx` — Push control explicitly labeled "unavailable"
- `docs/issue-12-native-hull-ios.md` — iOS native hull scaffolding documentation
- `docs/issue-12-native-hull-android.md` — Android native hull scaffolding documentation
- `docs/issue-12-privacy-statements.md` — Privacy statements for store contexts
- `docs/issue-12-store-metadata.md` — Store metadata templates (iOS + Android)

### Verification

- `npm run check` passes
- `npm test` passes (existing notification/E2E tests green)
- PWA installability: 0 errors (browser-verified per T-0033)
- No new browser push permission requests presented
- Transactional email channel integrates with existing `dispatchDueNotifications` outbox
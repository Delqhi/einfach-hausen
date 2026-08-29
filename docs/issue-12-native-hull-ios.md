# iOS Native Hull — Scaffolding Documentation (Issue #12)

**Status:** Scaffolding created for documentation; not submitted to App Store.

**Decision:** PWA is the approved launch channel (see `docs/issue-12-pwa-vs-native-distribution.md`). Native iOS distribution via App Store is not required for launch.

### Purpose

This document describes the thin native hull/package that would be required if native iOS distribution becomes necessary in the future. Currently, the PWA satisfies the mobile iOS needs via "Add to Home Screen" → standalone mode.

### Required Files (if/when native distribution is tasked)

| File | Description |
|------|-------------|
| `ios/EinfachHausen.xcodeproj/project.pbxproj` | Xcode project file — thin wrapper around WebView/PWALoading |
| `ios/EinfachHausen/Info.plist` | App metadata: CFBundleIdentifier, CFBundleVersion, UIUserNotificationSettings |
| `ios/EinfachHausen/AppDelegate.swift` | Entry point; requests push permission (disabled for launch) |
| `ios/EinfachHausen/ViewController.swift` | Loads `/manifest.webmanifest` PWA manifest; displays install prompt |
| `ios/EinfachHausen/PublicDependencies.plist` | Lists only the 4 public icons allowed in CacheStorage per T-0033 |
| `ios/EinfachHausen/PrivacyInfo.xcprivacy` | Privacy manifest — no user data collected by the hull |
| `ios/EinfachHausen/Assets.xcassets/AppIcon.appiconset/` | iOS app icons: 20, 29, 40, 57, 58, 60, 60x60@3x, 76, 83.5, 102, 120, 152, 167, 180, 1024@2x |
| `ios/EinfachHausen/Assets.xcassets/Icon-Small-50@2x.appiconset/` | Small icon for Settings |
| `ios/EinfachHausen/Assets.xcassets/Icon-Square-1028x1028.appiconset/` | Store listing screenshot mockup |

### App Store Connect Metadata (if/when tasked)

| Field | Value |
|-------|-------|
| Bundle ID | `de.einfachhausen.crm` (or as assigned) |
| App Name | `Einfach Hausen — Hausmeister-App` |
| Primary Category | `Lebensstil & Haus` or `Business` — as decided |
| Description | `Verwaltung von Haus und Garten, Auftragsabwicklung und Kommunikation mit Handwerkern.` |
| Keywords | `haus, handwerker, auftrag,immobilie, service, partenaire` |
| Screenshots | 5.5" iPhone, 6.1" iPhone, 12.9" iPad — mockup UI screens |
| Privacy Policy URL | `https://einfachhausen.de/datenschutz` |
| Marketing URL | `https://einfachhausen.de` |

### Review Test Paths

If native distribution is tasked, the following test paths must be verified before submission:

1. **Sandbox build + TestFlight** — Install via TestFlight on real iOS devices
2. **Push consent flow** — User grants push permission; message sends successfully
3. **Offline behavior** — App shows truthful 503 recovery page when offline (per T-0033)
4. **Review approval test** — Submit to App Store Review with test credentials; verify Reviewer can login and trigger all critical flows
5. **Rollback test** — Remove from TestFlight, verify PWA fallback works

### Current Status

- ❌ No Xcode project created
- ❌ No native build attempted
- ❌ No App Store Connect submission
- ✅ PWA installable via "Add to Home Screen" verified (T-0033, 0 installability errors)
- ✅ Browser Push explicitly unavailable in settings
- ✅ Privacy-first design — no user data in the hull

### Next Steps (if native distribution becomes required)

Create a new canonical task through `sin-gpt-web-state` with:
- Native iOS hull implementation
- App Store Connect coordination
- Review submission and approval
- Signing key management
- Marketing consent separation from transactional consent

Until then, the PWA is the approved and delivered launch channel for iOS.
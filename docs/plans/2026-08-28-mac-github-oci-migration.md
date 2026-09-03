# Mac-M1 → GitHub → OCI-VM migration

## Goal
Move the canonical `einfach-hausen` execution boundary from Mac-M1 to OCI-VM. Mac-M1 becomes source/release/recovery only. GitHub is the only transfer boundary. OCI-VM becomes the permanent execution host for Prime Agent GPT-5.6 Luna and SIN Supabase.

## Binding architecture

- Source/release checkout before migration: `/Users/jeremy/dev/einfach-hausen`
- Integration worktree on Mac: `/Users/jeremy/dev/einfach-hausen/.worktrees/oci-handoff-integration`
- Git remote: `https://github.com/Delqhi/einfach-hausen.git`
- Target execution host: OCI-VM
- Target auth/data authority: self-hosted SIN Supabase on OCI
- Supabase Cloud is not part of the target production architecture.
- GitHub is the only Mac→OCI transfer medium. Never rsync/scp/copy a Mac working tree directly to OCI.

## Mac release procedure

1. Fetch `origin/main`.
2. Integrate local project work into an isolated worktree based on `origin/main`.
3. Preserve remote changes and resolve conflicts explicitly.
4. Exclude local/runtime/generated state from Git:
   - `.worktrees/`
   - `node_modules/`
   - `.next/`
   - local databases/session stores
   - `.env`/credentials
   - Presenton runtime `app_data/`
   - benchmark/vendor clones
   - backup/intermediate artifacts that are not source or final deliverables
5. Include all meaningful project work required to continue development: application source, docs, task-related scripts, Notion references, brand assets, curated presentation sources/final deliverables.
6. Run the complete project gates before commit.
7. Commit to the integration branch.
8. Fast-forward/merge into `main` only after verification. Never force-push.
9. Push to GitHub and prove local integrated SHA == `origin/main` SHA.

## OCI bootstrap

1. Use the verified GitHub commit as the only source.
2. If an OCI checkout exists, fetch and fast-forward it. If not, clone from the exact origin URL.
3. Prove OCI HEAD equals the verified GitHub release SHA.
4. Discover the existing SIN Supabase deployment; do not create a parallel Supabase stack if one already exists.
5. Keep secrets in OCI/SIN secret management, never Git.
6. Generate the Luna execution handoff on OCI from the exact live source files so every code block is current.
7. Run Prime Agent Luna only on OCI for `einfach-hausen` after migration.

## Task chain

### T-0170 — Auth convergence against OCI SIN Supabase
Must run on OCI. Real Owner and Provider identities must exercise Supabase Auth, role isolation, logout/expiry, server-action authorization, and deterministic `auth_subject` mapping. `user_metadata.role` is never an authorization source. Local SQLite auth is development-only and must fail closed in production.

### T-0169 — Notion UI 1:1
Depends on T-0170. Run authenticated 390×844 captures on OCI. Every authoritative Owner Notion reference needs actual/reference/overlay/diff evidence. Provider is checked against the same design system unless a dedicated Provider reference exists.

### T-0171 — Final convergence
Depends on T-0170 and T-0169. Fresh security, auth E2E, visual acceptance, TypeScript, build, diff, GitNexus and taskplan validation must all pass on OCI.

## Product north star
Einfach Hausen is the personal house manager / operating system for the home: reduce mental load, increase decision confidence, preserve house memory and property value, and reduce fragmented tools and contacts. Primary promise: **Dein Haus. Einfach geregelt.**

## Non-negotiable constraints

- No `git reset --hard`.
- No `git clean`.
- No blanket `git restore`.
- No force push.
- No secret-bearing files in Git.
- No direct Mac→OCI filesystem copy.
- No Supabase Cloud dependency in the target architecture.
- No self-assigned server role from user-editable metadata.
- No completion claim without fresh evidence.

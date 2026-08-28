# TASK SPECIFICATION FOR EXECUTION AGENT — T-0170 OCI SIN Supabase

## Execution identity
- Host: OCI-VM only.
- Model: `openai-codex/gpt-5.6-luna`.
- Thinking: low.
- Repo source: exact verified GitHub `origin/main` release SHA supplied by orchestrator.
- Mac-M1 is forbidden as an execution host after migration.

## Authority order
1. This file.
2. Canonical taskplan.
3. `docs/T0168_DEEP_RESEARCH.md`.
4. `docs/ARCHITECTURE.md`.
5. `docs/PRODUCT_VISION.md` and `docs/PRODUCT_POSITIONING.md`.
6. Current repository code.
7. Existing tests.
8. Agent preference is never authoritative.

## Architecture
- Production auth/data authority: self-hosted SIN Supabase on OCI.
- Supabase Cloud: not part of target architecture.
- GitHub: only Mac→OCI transfer boundary.
- Local SQLite / `mh_session`: explicit development-only fallback.
- Production local auth must fail closed; no silent Supabase→local fallback.

## Security invariants
- Server authorization role must never derive from mutable `user_metadata.role`.
- Unknown Supabase identities must not self-provision Owner/Provider privileges.
- Stable mapping uses verified immutable `auth_subject` to an existing server-controlled application user.
- Email may only be a unique one-time migration bridge; collisions fail closed and subsequent requests use `auth_subject`.
- Owner cannot pass Provider authorization.
- Provider cannot pass Owner authorization.
- Invalid/expired sessions cannot access protected content.
- Logout invalidates protected access.
- Unauthenticated Server Actions cannot mutate state.

## Required full-code handoff generation on OCI
Before editing, create `.sin-gpt-web/T-0170_OCI_FULL_CODE_GOAL.md` from the exact checked-out source. It must embed the complete current contents, each in its own fenced code block with exact path, for:

- `src/lib/auth.ts`
- `src/lib/db.ts`
- `src/lib/supabase.ts`
- `src/components/AuthContext.tsx`
- `middleware.ts`
- `src/app/layout.tsx`
- `src/app/app/layout.tsx`
- `src/app/pro/layout.tsx`
- `src/app/login/page.tsx`
- `src/app/register-owner/page.tsx`
- `src/app/register-pro/page.tsx`
- `src/app/actions.ts`
- `scripts/t0168-dual-auth-regression.mjs`
- `scripts/t0170-auth-e2e.mjs`
- `scripts/security-regression.mjs`
- `package.json`
- `.env.example`
- `docs/ARCHITECTURE.md`
- `docs/T0168_DEEP_RESEARCH.md`

The full-code handoff must also include: exact OS/Node/npm/Git/Prime-Agent versions, branch, HEAD, full status, dependency versions from package/lock files, environment variable names without secret values, command sequence, negative constraints, acceptance criteria, failure handling and required output schema. No pseudo-code, TODOs, ellipses, guessed paths or omitted sections.

## OCI preflight
Record without secrets:
- `uname -a`
- `node --version`
- `npm --version`
- `git --version`
- `prime-agent --version`
- branch
- HEAD
- status

STOP if HEAD != orchestrator-provided release SHA. Do not copy files from Mac to repair it.

## SIN Supabase discovery
Use the existing OCI/SIN deployment. Do not create a second Supabase stack unless a separate authorized task explicitly requires it.

Verify and record only non-secret facts:
- gateway/API health
- Auth health
- Postgres reachability from the app boundary
- Storage health
- pooler/Supavisor health
- real project URL configured
- placeholder `your-project.supabase.co` absent from runtime configuration

Secrets stay in existing OCI/SIN secret management and must not appear in Git, logs, screenshots or evidence.

## Mandatory behavioral tests
The final implementation must prove:
1. unauthenticated `/app` → login
2. unauthenticated `/pro` → login
3. real OCI Supabase Owner → Owner app succeeds
4. real OCI Supabase Provider → Provider app succeeds
5. Owner → Provider-only denied
6. Provider → Owner-only denied
7. invalid/expired Supabase session denied
8. `mh_session` alone in Supabase mode denied
9. local mode works only in development
10. local mode in production fails closed
11. logout invalidates access
12. unauthenticated protected Server Action cannot mutate
13. modifying `user_metadata.role` cannot escalate server role
14. duplicate/collision email cannot bind the wrong app identity
15. mapped `auth_subject` is used on subsequent requests

String-search-only tests do not satisfy behavioral cases 3–15.

## Test identities
Use isolated OCI SIN Supabase test identities: exactly one Owner and one Provider. Do not expose their credentials.

## Forbidden actions
- no `user_metadata.role` server authorization
- no fake localStorage/cookie seeding as primary acceptance
- no silent local fallback
- no secrets committed
- no direct Mac working-tree copy
- no new library unless required by an explicit task need
- no unrelated refactors
- no `git reset --hard`
- no `git clean`
- no blanket `git restore`
- no force push

## Evidence
Write under `.sin-gpt-web/evidence/T-0170/oci/`:
- `environment.txt`
- `start-head.txt`
- `start-status.txt`
- `supabase-health.txt`
- `auth-regression.txt`
- `security-regression.txt`
- `auth-e2e.txt`
- `typescript.txt`
- `build.txt`
- `diff-check.txt`
- `gitnexus.txt`
- `final-status.txt`
- `report.md`

Never store secrets in evidence.

## Gate order
1. exact OCI baseline
2. GitNexus impact/context before non-trivial auth edits
3. failing behavioral regression for any discovered defect
4. minimal fix
5. auth regression
6. security regression
7. OCI real-auth E2E
8. TypeScript
9. `npm run build`
10. `git diff --check`
11. fresh GitNexus detect_changes
12. canonical taskplan render/validate
13. full handback

Use the actual scripts exposed by `package.json`. Every mandatory gate must exit 0 unless a proven external blocker remains.

## Task lifecycle
T-0170 can be completed only after real OCI SIN Supabase Owner/Provider acceptance passes. T-0169 remains dependent on T-0170. Do not directly edit taskplan SQLite; use `sin-gpt-web-state` lifecycle commands.

## Handoff format
Return:

TASK: T-0170
EXECUTION_HOST: OCI-VM
MODEL: openai-codex/gpt-5.6-luna
RESULT: complete|blocked
START_HEAD:
FINAL_HEAD:
BRANCH:
FILES_CREATED:
FILES_MODIFIED:
UNRELATED_WORK_PRESERVED: yes|no
SIN_SUPABASE_AUTHORITY: PASS|FAIL
REAL_OWNER_IDENTITY: PASS|FAIL
REAL_PROVIDER_IDENTITY: PASS|FAIL
METADATA_ROLE_NOT_AUTHORITATIVE: PASS|FAIL
UNKNOWN_IDENTITY_FAIL_CLOSED: PASS|FAIL
AUTH_SUBJECT_MAPPING: PASS|FAIL
EMAIL_COLLISION_FAIL_CLOSED: PASS|FAIL
LOCAL_PRODUCTION_FAIL_CLOSED: PASS|FAIL
ROLE_ISOLATION: PASS|FAIL
SERVER_ACTION_AUTHORIZATION: PASS|FAIL
AUTH_REGRESSION:
SECURITY_REGRESSION:
AUTH_E2E:
TYPESCRIPT:
BUILD:
DIFF_CHECK:
GITNEXUS:
TASKPLAN_VALIDATION:
EVIDENCE_PATH:
REMAINING_GAPS:
NEXT_TASK:

Then for every created or modified file include exact path, change reason, security effect, test coverage, followed by the complete final file contents in a fenced code block. No ellipses, TODOs or omitted sections.

## Definition of done
T-0170 is complete only when OCI HEAD begins from the verified GitHub release SHA, SIN Supabase OCI is the real authority, Owner and Provider real-auth paths pass, metadata cannot escalate role, identity mapping is deterministic/collision-safe, local production auth fails closed, security/auth/TypeScript/build/diff/GitNexus/taskplan gates pass, and all evidence is fresh.

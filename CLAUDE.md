# CLAUDE.md — ST Online 2.0 Build Constitution

**Revision 4.** Read this file fully at the start of every session before writing or
changing any code. It is short on purpose. It does not describe features — the
specifications do that. It states the rules that apply to *all* work, points to where the
real decisions live, and tells you how we work. When this file and your instinct
disagree, this file wins. When this file and the specifications disagree, the
specifications win (§3).

> **Codex / non-Claude-Code agents:** you are bound by this file exactly as Claude Code
> is. You do not read it automatically — `AGENTS.md` requires you to read it, plus the
> Stage 1 Build Specification and Data Model Rev 4, at the start of every task. See §11.

---

## 1. What this project is

ST Online 2.0 is a field-service and CRM platform for System Technique (ST), an Egyptian
water-treatment company serving hotels, hospitals, schools, clubs and compounds. Field
engineers (SEs) visit client sites, test water systems against configured parameter
ranges, and issue reports; supervisors (SLs) approve work; the Operations Manager (OM)
owns the rules. It replaces a 15-year-old legacy system.

### Releases and stages (ruling — read carefully)

There are exactly two **releases**: **v2.0** (what we build now) and **v2.1** (the later
release — full client portal, live 2-way ERP sync, digital signatures, smart schedule
auto-draft). Everything below is v2.0.

**v2.0 is delivered in STAGES, not sub-versions.** Do not invent version numbers like
2.01 / 2.02 — a version number implies something deployed, and that is the confusion this
ruling exists to kill. Use *stage* labels for build order only:

- **Stage 1 — the core operational loop.** Clients & sites → SOW → scheduling → visit
  form → readings → report generation → dispatch. (The team's "Slice 1 + Slice 2" live
  here.) This is what we build first and get working end-to-end.
- **Stage 2 — built after the loop works, each attaching to it:** MOM (2a), campaigns /
  audits (2b), microbiology (2c), training (2d). **All still v2.0.** None of these move
  to v2.1.

"Build for v2.1" therefore means: leave the seam so v2.1 attaches cleanly — **not** build
it early. Leave the seam, not the feature (see §7).

**Pilot:** one branch (Marsa Alam) before wider rollout.

---

## 2. The stack (ratified — do not re-litigate)

- **Language:** TypeScript everywhere, single monorepo.
- **Database:** PostgreSQL (managed). Migrations only — see §5.
- **Backend:** Node.js API on **NestJS** (ratified).
- **Web:** React (SL / OM / AN / admin interfaces).
- **Mobile:** responsive **PWA** for SEs in Stage 1. A native offline-first app
  (React Native / Expo) is a *later* decision, taken on pilot connectivity data — do not
  build native offline sync now (§7).
- **Reports:** HTML template → PDF via headless Chromium. Bidirectional text (Arabic runs
  inside English layout) via HTML `dir` — no exotic tooling (§8).
- **Deployment:** Docker; three environments (dev / staging / production).
- **Pinned versions (one lockfile, committed):** Node.js 24 LTS, PostgreSQL 18.x,
  TypeScript 6.x baseline, pnpm. TypeScript 7 is deferred until its tooling ecosystem
  (ESLint etc.) stabilises — revisit via ADR, do not adopt silently. Every major version
  change is an ADR, not a casual bump.

Framework/stack decisions are recorded as short ADRs in the repo. If you believe a stack
choice is wrong for a specific task, raise it as a flag (§3) — do not quietly substitute a
different library or pattern for a core decision.

---

## 3. Authority: where the truth lives

The authoritative specifications, committed to this repo, are:

- **Stage 1 Build Specification (E1)** — extract of the OM-held Master Knowledge Base
  Rev 13; every Stage 1 module, workflow and business rule.
- **Data Model & Schema Specification Rev 4** — entities, fields, the ruled structural
  decisions and the reasoning behind them.
- **Parameter Specification Rev 2** — the parameters across the 16 systems (config-load
  source; actual values loaded by the OM).
- **Corrective Action Procedures Rev 3.**

**Staged issuance (deliberate policy):** specifications are issued per stage. The Stage 2
Build Specification arrives when Stage 2 opens; v2.1 scope is OM-held. The Master
Knowledge Base Rev 13 (OM-held, not committed) is the ultimate source of truth behind the
extracts. If the Stage 1 spec appears silent or incomplete on something the task needs,
that is expected, not an error — flag it to the OM, who checks the master. Never invent
the missing piece, and never treat an absent module as out of scope (see §1 and §7).

**These supersede any older scope or status document (including any "Module Status Map")
wherever they conflict.** If an older document disagrees with these specs, the older
document is wrong — flag the conflict, do not act on the stale source.

Rules for using them:

1. **The spec is the source of truth. If code and spec disagree, the spec is right and
   the code is a bug.**
2. **If the spec itself looks wrong, incomplete, or contradictory — STOP the affected
   task and flag it. Do not "fix" it in code, a migration, or a diagram.** Stopping the
   *task* does not stop the session — continue other independent work; only the flagged
   item waits for a ruling. Every decision in these documents was ruled individually by
   the OM and carries reasoning that may not be visible locally. **Silent divergence from
   the spec is the primary failure mode of this build, and this project is organised
   specifically to prevent it — this is the most important rule in this file.**
3. When a decision is genuinely not covered by any spec, do not invent one. Flag it,
   propose the *simplest* option that satisfies the specs and survives v2.1, and wait.

**How to flag:** use a language-valid comment at the point in question — `//` in
TypeScript, `--` in SQL, `#` in YAML — tagged `FLAG(spec):`, **and** record it as a
tracked issue or in the session summary. A flag must never live only inside a source
comment; the tracked entry is what guarantees it is seen and ruled on.

**Issues do not outrank the spec.** GitHub issues track work; they are not the product
source of truth. The authority order is always:
**CLAUDE.md / Stage 1 Build Spec / Data Model Rev 4 → approved contract → issue → implementation.**

---

## 4. Non-negotiable design rules

These hold everywhere, on every entity, in every module. They are not style preferences —
they encode legal, commercial and audit requirements.

### 4.1 Config, not code
Parameters, parameter ranges, alert thresholds, standard letters, system types, branches,
campaign types, property types, and report templates are **OM-editable configuration read
at runtime** — never hardcoded, never a code constant. Config tables are marked `[CONFIG]`
in Data Model Rev 4. Distinguish three things and never conflate them:

- **Schema migration** — changes table/column *structure*. Version-controlled (§5).
- **Reference-data loader** — seeds/updates config *rows* (e.g. loading the Parameter
  Specification). Runs as a controlled, repeatable, idempotent step — not a hand edit.
- **Runtime configuration edit** — the OM changing a value in-app at runtime. This is the
  normal way business values change; it requires no deployment.

If a business value can only be changed by a developer editing code or writing a
migration, that is a bug. Config **may** be cached for performance, but a runtime config
change must invalidate the cache promptly and deterministically — a stale cached range or
threshold silently producing wrong results is a defect. State the invalidation mechanism
where you implement caching.

### 4.2 History is append-only and never restated
Effective-dated / historical tables (marked `[APPEND-ONLY]`) are **never restated or
deleted to rewrite the past** — a past record must forever read as it did at the time.
The **one** permitted mutation is closing the current open row: when a value changes, in a
**single transaction**, stamp the old row's `valid_to` and insert the new row, and update
the denormalised `current_*` pointer. That closing write is allowed; any other update, and
any delete, of historical rows is forbidden. Classification history, branch-assignment
history, and the visits-per-month change log all follow this.

### 4.3 Immutability of signed / approved / generated artifacts
Once committed, an artifact is frozen; corrections create a *new* artifact. The exact
transition at which each becomes immutable:

- **SOW revision** — immutable **at signature** (status Signed). A scope change is a new
  revision. Before signature it is an editable draft.
- **Visit** — immutable **at Approved**. A correction is a new visit. (Draft / Submitted /
  Returned are still editable; Approved is the lock point.)
- **Report** — immutable **at generation** (Report Generated). A correction is a new
  report that *supersedes* the original; the original is retained and marked superseded,
  never edited.

### 4.4 Snapshots freeze context at the moment of record
Values that could later change in config must be **copied onto the record when it is
written**, so the record's meaning never drifts:
- A **reading** snapshots the parameter range (min/max/flags) that applied *at entry*.
  Range edits apply **forward-only** — they never re-evaluate existing readings.
- A **SOW revision** snapshots physical data, star rating, frequency tier, and the
  catch-all clause wording at signature.
- A **report** snapshots its template version at generation.

### 4.5 Scope status is stamped, not inferred later
A reading carries `out_of_scope` (bool), set TRUE when no active SOW revision covers the
unit at visit time (excluded, provisional, or a no-SOW ANC/PC prospect site). It is a
**snapshot** — a later SOW revision bringing the system in-scope never rewrites it.

### 4.6 Two independent axes — never collapse them into one field
- `scope_status` (IN_SCOPE / EXCLUDED) is **not** `in_service_status`
  (IN_SERVICE / OUT_OF_SERVICE). A system can be in-scope but out of service.
- Market classification (C / ANC / PC / EXCLUDED / GREENFIELD) is **not** the future v2.1
  commercial-behaviour classification. Keep them separate.

### 4.7 Invariants live in the database, not only the UI
Critical invariants are enforced with **PostgreSQL constraints and transactions** —
foreign keys, NOT NULL, CHECK, unique constraints, and transactional integrity — not by
application or UI validation alone. UI validation is for user experience; the database is
what guarantees the rule holds. The append-only closing write (§4.2), the snapshot writes
(§4.4), and the SOW full-accounting rule are transaction-enforced.

### 4.8 Access is default-deny, enforced at the API
Role-based access is enforced **server-side, default-deny**: no access unless a rule
grants it. **The client never sees internal/pipeline data** — enforced at the API, not by
hiding a component. Access scoping:
- **SE** sees clients/sites where they are the assigned engineer, and their own visits.
- **SL** sees sites whose **current** branch assignment (the denormalised pointer) is a
  branch/area they lead.
- **OM / AN / MD** see cross-branch per the Stage 1 Build Spec §1.2.
Every access rule ships with tests for both an **allowed** and a **forbidden**
role/branch case.

### 4.9 Language
Config labels are stored **paired** (`_en` / `_ar`). Report output furniture is English
for v2.0, held as a **site preference defaulting to English** (not hardcoded). User free
text is stored **as typed**, direction-tagged, and rendered **verbatim** — an English
report carries an Arabic remark as Arabic. **Never auto-translate user content.**

### 4.10 Time and dates
Store all timestamps in **UTC**. Apply business logic in **Egypt local time**. "Effective
dates" (SOW, assignments, classification) are **calendar dates in Egypt local time**.
"Same-day submission" means the **same Egypt-local calendar day** as the visit. Never let
a UTC/local mismatch decide whether a submission was same-day.

### 4.11 Secrets and sensitive data
No credentials, API tokens, `.env` secrets, connection strings, or sensitive production
data ever committed to Git or written to logs. Secrets come from the environment / a
secrets manager. Client data and specifications are proprietary — treat accordingly, and
see §10 on external services.

### 4.12 Idempotency for side effects
Report generation, email, and WhatsApp dispatch must be **idempotent** — a retry after a
failure must never send the client a second copy or produce a duplicate artifact. Use
idempotency keys and controlled retries; a dispatch record (one per channel per recipient)
is the ledger that prevents double-send.

### 4.13 Immutable-artifact storage
Generated reports, signed SOW scans, and visit attachments are stored in object storage
as **immutable, versioned** objects with a **checksum** recorded on the owning row.
Superseding never overwrites — it writes a new object and marks the old one superseded.
Backups and lifecycle policies apply; a stored artifact must be retrievable, unchanged,
for as long as the retention policy requires.

---

## 5. How we work

- **Migrations only.** Every schema change is a version-controlled migration file. The
  database is never hand-edited, in any environment. **A deployed migration is
  immutable** — corrections are a *later* migration, never an edit to the shipped one.
- **Destructive changes are expand-and-contract**, never in-place: add the new shape,
  migrate data, switch reads, then drop the old shape in a later migration once nothing
  uses it. "Forward-only in spirit" means: never a destructive edit that rewrites or
  discards historical data to make a change convenient. A failed deployment rolls back by
  deploying a *corrective forward migration*, not by editing history.
- **Small, verified tasks.** One feature at a time, following the Stage 1 build order
  (§6). Each ends with something runnable and checked against the relevant spec section.
  Never "build the whole module" in one pass.
- **Mandatory verification gate before any task is "done":** format, lint, type-check,
  the test suite, and migration validation (build the database from zero + run
  migrations) all pass. No exceptions.
- **Git discipline.** Feature branches; `main` always deployable to staging. Commit
  messages reference the spec section implemented and the issue.
- **Tests where they earn their place** (mandatory):
  - the **alert-rule engine** — the ten rules × their configurable thresholds;
  - **range-snapshot and out-of-range** computation on readings;
  - the **SOW full-accounting validation** at sign-off;
  - the **append-only / snapshot / immutability** invariants (as database tests);
  - (later) **V/V** and commercial computations.
  UI and CRUD get lighter testing. Do not gold-plate coverage on plumbing.
- **Audit logging.** Approvals, dispatches, config changes and classification changes
  record actor + timestamp. The data model requires this — honour it.
- **Acceptance is per stage, by the business.** A stage is "done" when it matches its Build Specification
  on staging, not when it runs. Expect the OM to test it decision-by-decision.

---

## 6. Stage 1 build order (each step ends demonstrable)

1. Repo + this file + `AGENTS.md` + environments + auth skeleton with the role model
   (SE / SL / OM / AN / MD, plus Sales / Lab / Branch Accountant / Hospitality Financial Manager / Finance).
2. Core schema migrations — straight from Data Model Rev 4 (entity list in §9).
3. Config admin screens, then **load the Parameter Specification as data** via a
   reference-data loader — the first real test of "config, not code."
4. Clients & sites — group/site, contacts (report-recipient flag OFF by default),
   classification with history + AN confirm, effective-dated branch assignment.
   ANC/PC/prospect sites support system capture (no SOW filter) for commercial potential.
5. System units & SOW — units on the *site*; SOW revisions with IN_SCOPE/EXCLUDED lists,
   full-accounting validation at sign-off, catch-all clause snapshot, signed-scan upload,
   one active SOW per site. **SOW lifecycle: SE drafts → SL approves → Branch Accountant approves (branch-level financial, derived from the client's current branch) → OM acknowledges; Hospitality Financial Manager + AN are NOTIFIED on approval (oversight, not a gate).**
6. Visit form — scope-driven two sections: in-scope validated work surface; out-of-scope
   collapsed glance list, **expandable per system into full optional analysis**;
   provisional-system capture; blind entry with the OOR exception (below); identical-
   readings check; same-day submission (below); visit-time validation.
7. Readings & snapshots — range snapshot, in/out-of-range, severity, sequence number.
8. Report generation — HTML→PDF engine, English furniture, Arabic free text verbatim
   RTL-in-LTR, stored versioned artifact, NOT-WITHIN-SCOPE section with information-only
   disclaimer, superseding-report path. **NOTE: the report DESIGN is an open, high-
   priority item being ruled separately (the "seven-pillar", customer-value structure).
   Build the ENGINE against a provisional template; do not let a placeholder become the
   final report by inertia. The final design drops in before pilot.**
9. Stage 1 acceptance — full walkthrough on staging against the Stage 1 Build Spec + Data Model Rev 4.

**Scheduling behaviour (Stage 1):** the system **suggests the visit count** per C client
from the **live `current_visits_per_month`** field (never a fixed SOW figure — so an
SL/MOM change to cadence is reflected automatically). **The SE manually assigns those
visits to specific dates.** v2.1 adds an **optional** auto-drafted schedule the SE adjusts;
manual scheduling always remains available. Do not build the auto-draft now.

**Blind-entry rule (step 6), precisely:** at entry, for each parameter, show the previous
reading **only if the immediately previous reading (by sequence) was out of range or
severity-flagged**; otherwise the field is blank (blind entry). "Immediately previous"
means the most recent prior reading for that unit+parameter, regardless of how long ago.
Full history remains server-side (alert rules and the identical-readings check always run
on complete history) and in review screens after submission. The "Not critical" flow still
forces display of previous readings before the SE can confirm — a separate gate, unchanged.

**Same-day submission (step 6):** the system **prompts** the SE to submit on the same
Egypt-local calendar day as the visit; it does **not** hard-block a later submission. A
late submission is flagged for SL visibility. Prompt, don't enforce — consistent with the
project-wide "prompt over enforce" principle.

Stage 2 follows the same pattern, in order: MOM → campaigns/audits → microbiology →
training. (WhatsApp Business Platform has external lead time — start its account setup
during Stage 1.)

---

## 7. Deliberately deferred — do not build now

Building these now is premature and off the critical path. If a task seems to need one,
flag it (§3) rather than starting it.

- **Native offline sync** (conflict resolution, queued writes, partial-data
  reconciliation). Stage 1 is PWA with **local draft-save** so a form survives a dropped
  connection. Local draft persistence supports *drafting only*: **submission requires
  connectivity** (the report/alert/dispatch pipeline is server-side). A local draft
  persists until it is successfully submitted, then is cleared. The native app is a
  post-pilot decision.
- **v2.1 smart schedule auto-draft** — optional when it arrives (§6). Not now.
- **Live ERP (Oracle) sync.** v2.0 is a **manual import** screen/template for sales EGP,
  chlorine kg, and offer/PO records. 2-way sync is v2.1.
- **Client portal, digital signatures, commercial-behaviour classification.** v2.1+.

**"Build for v2.1" means make it *attach cleanly later*, not build it early. Leave the
seam, not the feature.** A reading already has everything the alert engine needs, so
Stage 2's rules attach with no schema change — that is the standard to hold.

Note: MOM, campaigns, microbiology and training are **v2.0 Stage 2**, NOT deferred and NOT
v2.1. They are built after the Stage 1 loop works. Do not start them before the loop is
accepted, but do not treat them as out of scope.

---

## 8. Two things to prove early (not assume)

- **RTL-in-LTR PDF:** render a real Arabic-remark sample inside an English report at
  step 8 and eyeball it. A selection criterion, not a hope.
- **Config-as-data:** loading the Parameter Specification at step 3 must require zero code
  changes to add/edit a parameter or range. If it doesn't, the config architecture is
  wrong — flag it before building on top.

---

## 9. Entity reference (Data Model Rev 4 — authoritative)

Core-loop tables. Names are **singular snake_case**. `[CONFIG]` = OM-editable;
`[APPEND-ONLY]` = never restated (one closing write only, §4.2); `*_id` = FK; `current_*`
= denormalised pointer maintained with its history row.

- **Org / users:** `app_user`, `branch_area` [CONFIG] (carries `sl_user_id` AND `branch_accountant_user_id` — both per-branch role pointers)
  *(the user table is named `app_user`, NOT `user` — `user` is reserved in PostgreSQL.
  Reporting line is DERIVED: `app_user.branch_area_id → branch_area.sl_user_id` — no
  `reports_to` field, no SE-assignment-history table.)*
- **Clients:** `client_group`, `site`, `site_classification_history` [APPEND-ONLY],
  `site_branch_assignment` [APPEND-ONLY], `contact`.
- **Systems & SOW:** `system_unit`, `sow`, `sow_revision`, `sow_revision_system`.
- **Scheduling:** `scheduled_visit`, `sales_visit_plan`.
- **Visits & readings:** `visit`, `reading`.
- **Parameter config spine:** `system_type` [CONFIG], `parameter` [CONFIG]
  (Model A — flags on the parameter, no Test Type table), `system_type_parameter`,
  `parameter_range` [CONFIG] (nullable min / nullable max; dormant `source_set_id` for
  v2.1 per-source ranges).
- **Reports:** `report`, `dispatch` (one row per channel per recipient).

Visit lifecycle (six states):
`Draft → Submitted → (Returned → Submitted)* → Approved → Report Generated → Report Dispatched`.
Returned is distinct (carries reason + count). Report Generated is split from Report
Dispatched — the Mode A/B queue hold lives between them. *(These are states of the visit's
progression; `report` and `dispatch` are their own entities recording the artifact and the
sends — the state names mark the visit's position, the entities hold the data.)*

Alert engine: **ten rules as tested, coded logic**; one `alert_rule` [CONFIG] row per rule
holds its editable thresholds and routing. **Not a generic rule-builder.** The **safety
fast-track sits OUTSIDE the ten** — a critical-safety-result property that always notifies
the OM and fires as an early dispatch ahead of the report.

---

## 10. External services and tools

- **AI coding tools** (Claude Code, Codex) run under **company-owned** accounts — never
  personal. IT owns the credentials.
- **External AI code review** (e.g. CodeRabbit): approved for use, but understand it
  transmits code and possibly spec context to a third party. Only approved reviewers,
  under company accounts, with awareness that proprietary material leaves our boundary.
- **Third-party workflow tooling** is vendored at a **pinned commit** and reviewed before
  use — never run an installer piped from a mutable branch. Any tool's generic rules that
  conflict with this file or Data Model Rev 4 are overridden by this file.
- **This constitution is protected.** No automated workflow may edit CLAUDE.md. Any change
  to it goes through OM review and an explicit ruling, then a revision bump and a change-
  log entry (§12).

---

## 11. For Codex / the database track (AGENTS.md contract)

Codex does not read this file automatically. `AGENTS.md` at the repo root requires every
database-track task to first read: **CLAUDE.md, the Stage 1 Build Specification, Data Model Rev 4, and
the task's acceptance criteria.** `AGENTS.md` points to this file; it does not duplicate
its rules. In addition:

- **Only the database track** modifies `packages/database`, schema definitions, or
  migrations — enforced by CODEOWNERS. Delegated/other agents must not create or alter
  migrations.
- CI builds the database **from zero** and runs migration, constraint, history, snapshot,
  and schema-drift checks on every change.
- Every database task and PR names the specification sections it implements.
- A spec conflict **stops the affected task** and is recorded as a flagged question
  (§3) — Codex must not resolve it by assumption.
- Each session summary records: specifications read, migrations created, tests run,
  unresolved flags.

---

## 12. When unsure — and change control

**When unsure, stop the task and flag.** A five-minute question to the OM is cheaper than
a plausible-looking divergence found in acceptance. Never batch-assume, never silently
"improve," never leave the spec and the code disagreeing.

This project runs on one-decision-at-a-time, explicit-ruling discipline — the build
continues it. Changes to *this file* are themselves ruled: OM review, then a revision bump
and a change-log line below. No agent or workflow edits it autonomously.

### Change log
- **Rev 3 → Rev 4.** Org & SOW-approval corrections per KB Rev 13 / Data Model Rev 4:
  role list gains Branch Accountant and Hospitality Financial Manager; SOW lifecycle in §6
  updated to SE → SL → Branch Accountant (branch-derived) → OM acknowledges, with
  Hospitality Financial Manager + AN notified (not gating); `branch_area` noted as carrying
  `branch_accountant_user_id` alongside `sl_user_id`; authority pointers updated to KB Rev 13
  and Data Model Rev 4. No other rules changed.
- **Rev 2 → Rev 3.** Authority pointers updated for the staged information-release
  policy: committed specs are now the Stage 1 Build Specification (E1, extract of the
  OM-held Master KB Rev 12), Data Model Rev 3 (the app_user revision), Parameter
  Specification Rev 2, and CAP Rev 3. Added the staged-issuance rule to §3 (Stage 2 spec
  arrives when Stage 2 opens; v2.1 OM-held; apparent gaps are flagged, never invented).
  Live references to "Rev 10" / "Data Model Rev 2" updated throughout; historical
  change-log entries left as written. No design rules changed.
- **Rev 1 → Rev 2.** Incorporated the development team's CLAUDE.md review and OM rulings.
  Fixes: §4.2 append-only wording corrected (one permitted closing write); `user` renamed
  `app_user` (§9); flag syntax made language-valid + tracked (§3). Additions: verification
  gate, secrets rule, timezone convention, DB-constraint enforcement, default-deny API
  authorization, pinned versions, idempotency, immutable-artifact storage (§4.7–4.13, §5,
  §10). Clarifications: STOP=task not session (§3), migration vs loader vs runtime-config +
  cache invalidation (§4.1), exact immutability transition points (§4.3), access scoping
  (§4.8), report vs visit state naming (§9), same-day + offline behaviour (§6–7),
  expand-and-contract / forward-only (§5). Rulings: v2.0 delivered in **stages** not
  sub-versions, MOM/campaigns/micro/training are v2.0 Stage 2 (§1, §7); Training = Stage 2d;
  Stage-1 scheduling = suggest-count / manual-placement, v2.1 auto-draft optional (§6);
  SOW lifecycle SE→SL→OM (§6); Rev 10 + Data Model Rev 2 supersede the Module Status Map
  (§3); report design is an open high-priority item, build engine against provisional
  template (§6); NestJS ratified, versions pinned (§2); Codex AGENTS.md contract (§11);
  external-tool / Wizard / constitution-protection rules (§10).
- **Rev 1.** Initial constitution.

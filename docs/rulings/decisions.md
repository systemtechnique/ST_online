# Approved Owner Rulings

This is the durable register for explicit owner rulings made after the committed
specifications. It does not replace or silently edit a specification. A material ruling
must later be reconciled into the appropriate specification revision.

## Recording Format

Copy the following block for each approved ruling:

```text
RULING ID:
Date:
Owner:
Related question:
Affected specification sections:
Decision:
Reasoning:
Implementation impact:
Effective from:
Reconciled specification revision:
Repository references:
```

## Rulings

### RULING-2026-08-10-001: Separate Greenfield status

- **Date:** 2026-08-10
- **Owner:** Kamal (approval relayed by Mohamed)
- **Related question:** `SPEC-003`, GitHub issue `#2`
- **Affected specification sections:** Stage 1 E1 sections 2.1 and 2.5; Data Model Rev 4 sections 1.2 and 7.
- **Decision:** Greenfield/Operating status is a separate axis from operating-hotel
  market classification. `site.market_status` holds `GREENFIELD` or `OPERATING`.
  Operating sites are classified exactly once as `C`, `ANC`, `PC`, or `EXCLUDED`;
  Greenfield sites are not included in TOH.
- **Reasoning:** The separate fields preserve the Stage 1 counting rule and allow a
  Greenfield site to become operating without moving it to a different entity.
- **Implementation impact:** Remove `GREENFIELD` from the market-classification value
  set. Add `market_status` to `site`; keep market classification and its append-only
  history as a separate concern. Enforce the valid status/classification combinations
  in PostgreSQL when the ERD is approved.
- **Effective from:** First Stage 1 ERD.
- **Reconciled specification revision:** Pending.
- **Repository references:** `docs/erd/traceability.md`.

### RULING-2026-08-10-002: Canonical branch names and roster aliases

- **Date:** 2026-08-10
- **Owner:** Kamal (approval relayed by Mohamed)
- **Related question:** `SPEC-004`, GitHub issue `#3`
- **Affected specification sections:** Stage 1 E1 section 1; Branch & User Roster dated
  6 August 2026; Users, Roles & Access Questionnaire Rev 3 Part 1.
- **Decision:** The specification and roster describe the same operating structure
  using different labels. Use the Stage 1 E1 names as the canonical configuration:
  `Hurghada`, `Sharm El Sheikh`, `Cairo`, `Alexandria`, `North Coast`, `Marsa Alam`, and
  `Upper Egypt (Luxor/Aswan)`. Roster labels are import aliases: `Sharm` maps to
  `Sharm El Sheikh`; `Alex + Sahel` is combined coverage of the separate canonical
  `Alexandria` and `North Coast` units; and `Luxor` maps to
  `Upper Egypt (Luxor/Aswan)`. Alexandria and North Coast may share the same SL and
  Branch Accountant without becoming one branch.
- **Reasoning:** This preserves the locked E1 structure while retaining the current
  operational roster and its shared assignments.
- **Implementation impact:** Model branches as OM-editable `branch_area` configuration.
  Treat aliases as controlled import mappings, not additional branches. Seed people and
  shared assignments from the approved roster only through a controlled loader.
- **Effective from:** First Stage 1 ERD and branch reference-data loader.
- **Reconciled specification revision:** Pending.
- **Repository references:** `docs/erd/traceability.md`.

### RULING-2026-08-10-003: Normalized role and permission model

- **Date:** 2026-08-10
- **Owner:** Kamal (approval relayed by Mohamed)
- **Related question:** `SPEC-005`, GitHub issue `#4`
- **Affected specification sections:** Data Model Rev 4 `app_user`; Users, Roles & Access
  Questionnaire Rev 3 Parts 0, 3, 4, and 5; CLAUDE.md section 4.8.
- **Decision:** Use a normalized role system, not one fixed enum field on `app_user`.
  Users may hold multiple roles. The management-chain roles are protected system roles;
  office/support roles are extensible configuration that the OM can add. Permissions
  are assigned to roles, and user-role assignments carry any required branch/area
  scope.
- **Reasoning:** The model must support dual-role users, shared unit leadership, and new
  office roles without code or schema changes while retaining the fixed management
  chain semantics.
- **Implementation impact:** Replace `app_user.role` with normalized `role`,
  `permission`, `user_role`, and `role_permission` relationships in the proposed ERD.
  Keep authorization server-side and default-deny. Exact permission grants remain
  blocked until Questionnaire Rev 3 Part 4 is completed.
- **Effective from:** First Stage 1 ERD and authorization contract.
- **Reconciled specification revision:** Pending.
- **Repository references:** `docs/erd/traceability.md`; `SPEC-009`.

### RULING-2026-08-11-004: Site registration identity and URC state

- **Date:** 2026-08-11
- **Owner:** Kamal
- **Related question:** `SPEC-010`, `DATA-001`, GitHub issue `#10`
- **Affected specification sections:** Stage 1 E1 section 2; Data Model Rev 4 section
  1.2 `site`.
- **Decision:** Every site has a required name, address/location data, active/inactive
  status, and ERP Client Code rules. A registered site must have one non-null, globally
  unique ERP Client Code. A new client not yet registered in the ERP is held as an
  `URC` (Unregistered Client); only a URC may have a null ERP Client Code. Registration
  assigns the ERP code and ends the URC state. Existing PC sites are registered and
  therefore have ERP codes.
- **Implementation impact:** Add the ruled identity fields and a distinct registration
  state to the proposed `site` model. Enforce required-and-unique ERP codes for
  registered sites and null-only-for-URC in PostgreSQL. Legacy blank and duplicate codes
  must be rejected for reconciliation, never silently accepted. Exact address/location
  columns will be reconciled with the promised formal Data Model update during ERD
  review.
- **Effective from:** First site ERD and migration.
- **Reconciled specification revision:** Pending formal Data Model update.
- **Repository references:** `docs/erd/stage-1-slice-1.md`.

### RULING-2026-08-11-005: Company email is the user login identity

- **Date:** 2026-08-11
- **Owner:** Kamal
- **Related question:** `SPEC-011`, GitHub issue `#11`
- **Affected specification sections:** CLAUDE.md sections 4.8 and 6 step 1; Data Model
  Rev 4 section 1.1 `app_user`.
- **Decision:** Company email is the permanent, unique login identifier. Only
  company-owned accounts may be used; personal accounts are prohibited.
- **Implementation impact:** Add a required unique `login_email` to `app_user`. Do not
  hardcode one email domain; account ownership is validated by the authentication
  contract. Authentication-provider selection remains a technical ADR before auth
  implementation, but does not block the user-table identity field.
- **Effective from:** First user ERD and migration.
- **Reconciled specification revision:** Pending.
- **Repository references:** `docs/erd/stage-1-slice-1.md`.

### RULING-2026-08-11-006: Parameter count and Stage 1 source ranges

- **Date:** 2026-08-11
- **Owner:** Kamal
- **Related questions:** `SPEC-001`, `SPEC-002`
- **Affected specification sections:** Parameter Specification Rev 2; Stage 1 E1
  section 16; Data Model Rev 4 section 4.
- **Decision:** Parameter Specification Rev 2 is the config-load source with 128
  parameters, 96 required, and 15 inhibitor parameters. Stage 1 launches Mains Water
  with one shared range set for all sources. The source-keyed range-set architecture is
  built but dormant; source subtype is context only until per-source ranges are enabled
  later as a configuration change.
- **Implementation impact:** Loader acceptance requires exactly the ruled Rev 2 counts.
  Preserve `source_set` capability without activating source-specific Mains Water range
  selection in Stage 1.
- **Effective from:** Parameter ERD, loader, and reading selection logic.
- **Reconciled specification revision:** Pending E1/Data Model correction.
- **Repository references:** `docs/rulings/open-questions.md`.

### RULING-2026-08-11-007: Internal notifications and immutable artifacts

- **Date:** 2026-08-11
- **Owner:** Kamal
- **Related questions:** `SPEC-006`, `SPEC-007`
- **Affected specification sections:** CLAUDE.md section 4.13; Stage 1 E1 SOW approval
  chain; Data Model Rev 4 sections 1.3, 5.1, and 5.2.
- **Decision:** Internal notifications target `app_user` recipients by role and remain
  fully separate from client report dispatch. They never use `dispatch`, `contact`, or
  `is_report_recipient`. Immutable artifacts record object location, checksum, content
  type, byte size, language variant, and version.
- **Implementation impact:** Propose a dedicated internal-notification structure and an
  immutable artifact structure through the ERD process. Client dispatch remains one row
  per channel, client contact, and send attempt as already specified.
- **Effective from:** SOW-notification and artifact ERD slices.
- **Reconciled specification revision:** Pending.
- **Repository references:** `docs/erd/traceability.md`.

### RULING-2026-08-11-008: Stage 1 support-structure sequencing

- **Date:** 2026-08-11
- **Owner:** Kamal
- **Related question:** `SPEC-008`
- **Affected specification sections:** Stage 1 E1 sections 12 and 21; Data Model Rev 4.
- **Decision:** Standard-letter structures are proposed through the ERD process against
  E1 section 21. Internal notifications and permissions are also proposed through the
  ERD process because Stage 1 needs them. The TECH/REL/COM/STRAT flag system and account
  watchlist are unsettled design items: do not build or model them in Stage 1; they
  attach only after a later owner ruling.
- **Implementation impact:** Remove flags/watchlists from the Stage 1 implementation
  queue without inventing placeholder tables. Track the attachment boundary only.
- **Effective from:** Stage 1 planning and ERD scope.
- **Reconciled specification revision:** Pending E1 correction.
- **Repository references:** `docs/erd/traceability.md`.

### RULING-2026-08-11-009: Legacy SOW is reference only

- **Date:** 2026-08-11
- **Owner:** Kamal
- **Related question:** `DATA-006`
- **Affected specification sections:** Stage 1 E1 section 5.
- **Decision:** The supplied legacy SOW is a reference sample showing real operational
  structure. It is not a template to reproduce. The new SOW design follows E1 section 5.
- **Implementation impact:** Do not import or copy the legacy document shape as the new
  SOW contract or report template.
- **Effective from:** SOW ERD and artifact design.
- **Reconciled specification revision:** Not required.
- **Repository references:** `docs/rulings/open-questions.md`.

### RULING-2026-08-11-010: Phase 0 technical processes

- **Date:** 2026-08-11
- **Owner:** Kamal
- **Related approvals:** Database tooling ADR, ERD process, API-contract process.
- **Decision:** Approve `node-pg-migrate`, `pg`, PostgreSQL as schema authority, and no
  ORM as initial schema authority. Approve Markdown/Mermaid ERDs with each slice approved
  before migration. Approve OpenAPI 3.1 and contract-first delivery.
- **Implementation impact:** The tooling ADR moves to approved with its technical smoke
  gate still required before acceptance. The ERD and API-contract process documents are
  approved. No migration starts until its actual ERD slice is separately approved.
- **Effective from:** Phase 0.
- **Reconciled specification revision:** Not required.
- **Repository references:** `docs/adr/0001-database-tooling.md`;
  `docs/engineering/api-contract-process.md`.

### RULING-2026-08-11-011: Private-repository governance

- **Date:** 2026-08-11
- **Owner:** Kamal
- **Related approvals:** GitHub plan and independent reviewer.
- **Decision:** Keep the repository private, upgrade the GitHub plan to enable branch
  protection, and create a second company GitHub account for independent approval. The
  reviewer cannot be the author of the code under review.
- **Implementation impact:** Account/billing owner performs the plan purchase. Mohamed
  proposes a named independent account holder before enabling required approvals and
  CODEOWNER review.
- **Effective from:** Phase 0 repository governance.
- **Reconciled specification revision:** Not required.
- **Repository references:** `docs/engineering/branch-protection.md`.


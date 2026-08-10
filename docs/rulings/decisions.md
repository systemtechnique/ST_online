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


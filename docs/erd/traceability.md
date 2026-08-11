# Stage 1 ERD Traceability Matrix

This is not the ERD. It maps each ruled entity to its authoritative source and records
whether it can be rendered without assumption.

Statuses:

- **READY:** the current structural relationship can be rendered from the specification.
- **PARTIAL:** an unaffected portion may be rendered, but named fields or adjacent
  structures still require a ruling.
- **BLOCKED:** drawing the entity now would choose between contradictory or missing rules.

| Area | Entity | Status | Source / blocker |
| --- | --- | --- | --- |
| Organisation | `app_user` | READY FOR ERD | Data Model Rev 4 section 1.1; `RULING-2026-08-10-003`; company email identity ruled by `RULING-2026-08-11-005` |
| Organisation | `role`, `permission`, `user_role`, `role_permission` | PARTIAL | `RULING-2026-08-10-003`; exact permission seeds remain blocked by `SPEC-009` |
| Organisation | `branch_area` | READY | Data Model Rev 4 section 1.1; `RULING-2026-08-10-002`; `DATA-004` affects legacy-area import, not table shape |
| Clients | `client_group` | READY | Data Model Rev 4 section 1.2 |
| Clients | `site` | PARTIAL | Data Model Rev 4 section 1.2; identity/URC rules in `RULING-2026-08-11-004`; exact address/location columns pending formal model |
| Clients | `site_classification_history` | READY | Data Model Rev 4 section 1.2; `RULING-2026-08-10-001` |
| Clients | `site_branch_assignment` | READY | Data Model Rev 4 section 1.2; `RULING-2026-08-10-002` |
| Clients | `contact` | PARTIAL | Data Model Rev 4 section 1.2; recipient mapping blocked by `DATA-005` |
| Systems | `system_unit` | PARTIAL | Data Model Rev 4 section 1.3; grouped `physical_data` and date fields need explicit column treatment |
| SOW | `sow` | READY | Data Model Rev 4 section 1.3 |
| SOW | `sow_revision` | READY FOR ERD | Data Model Rev 4 section 1.3; internal notifications and artifact fields ruled by `RULING-2026-08-11-007` |
| SOW | `sow_revision_system` | READY | Data Model Rev 4 section 1.3 |
| Scheduling | `scheduled_visit` | READY | Data Model Rev 4 section 2.1 |
| Scheduling | `sales_visit_plan` | READY | Data Model Rev 4 section 2.2 |
| Visits | `visit` | READY | Data Model Rev 4 section 3 |
| Readings | `reading` | READY | Data Model Rev 4 section 4.2; Stage 1 shared-range selection ruled by `RULING-2026-08-11-006` |
| Configuration | `system_type` | PARTIAL | Data Model Rev 4 section 4.1; exact typed physical-data mechanism requires tracing |
| Configuration | `parameter` | READY | Data Model Rev 4 section 4.1; 128-row config source ruled by `RULING-2026-08-11-006` |
| Configuration | `system_type_parameter` | READY | Data Model Rev 4 section 4.1 |
| Configuration | `parameter_range` | READY | Data Model Rev 4 section 4.1; source-keyed architecture dormant at launch per `RULING-2026-08-11-006` |
| Alerts | `alert_rule` | PARTIAL | CLAUDE.md section 9 and Data Model Rev 4 section 4.3; routing targets require explicit fields |
| Reports | `report` | READY FOR ERD | Data Model Rev 4 section 5.1; artifact fields ruled by `RULING-2026-08-11-007` |
| Reports | `dispatch` | READY | Data Model Rev 4 section 5.2; client dispatch remains separate from internal notification |
| Stage 1 support | Standard letters | READY FOR ERD | E1 section 21; propose through ERD per `RULING-2026-08-11-008` |
| Stage 1 support | Permissions and internal notifications | PARTIAL | Structure may be proposed; permission seeds wait for `SPEC-009` |
| Deferred design | TECH/REL/COM/STRAT flags and account watchlist | DEFERRED | Do not model or build until later owner ruling (`RULING-2026-08-11-008`) |

## First Candidate Slice

The first ERD slice covers the minimum dependency chain needed for clients and
branch-scoped access:

`role` / `permission` -> `app_user` -> `branch_area` -> `site` -> classification and
branch-assignment histories.

The proposed rendering is in `docs/erd/stage-1-slice-1.md`. Role structure, login
identity, site identity rules, Greenfield, and branch structure are ruled. The exact site
address/location columns and owner review remain pending. `SPEC-009` prevents final
permission seed data but does not prevent the normalized role structure. No migration
may be created until this ERD slice is reviewed and explicitly approved.

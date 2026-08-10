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
| Organisation | `app_user` | BLOCKED | Data Model Rev 4 section 1.1; `SPEC-005` role cardinality/extensibility |
| Organisation | `branch_area` | BLOCKED | Data Model Rev 4 section 1.1; `SPEC-004`, `DATA-004` |
| Clients | `client_group` | READY | Data Model Rev 4 section 1.2 |
| Clients | `site` | BLOCKED | Data Model Rev 4 section 1.2; `SPEC-003`, `DATA-001` to `DATA-003` |
| Clients | `site_classification_history` | BLOCKED | Data Model Rev 4 section 1.2; `SPEC-003` |
| Clients | `site_branch_assignment` | BLOCKED | Data Model Rev 4 section 1.2; `SPEC-004` |
| Clients | `contact` | PARTIAL | Data Model Rev 4 section 1.2; recipient mapping blocked by `DATA-005` |
| Systems | `system_unit` | PARTIAL | Data Model Rev 4 section 1.3; grouped `physical_data` and date fields need explicit column treatment |
| SOW | `sow` | READY | Data Model Rev 4 section 1.3 |
| SOW | `sow_revision` | PARTIAL | Data Model Rev 4 section 1.3; signed artifact fields and internal notification path need `SPEC-006`/`SPEC-007` |
| SOW | `sow_revision_system` | READY | Data Model Rev 4 section 1.3 |
| Scheduling | `scheduled_visit` | READY | Data Model Rev 4 section 2.1 |
| Scheduling | `sales_visit_plan` | READY | Data Model Rev 4 section 2.2 |
| Visits | `visit` | READY | Data Model Rev 4 section 3 |
| Readings | `reading` | PARTIAL | Data Model Rev 4 section 4.2; range-selection behaviour blocked by `SPEC-002` |
| Configuration | `system_type` | PARTIAL | Data Model Rev 4 section 4.1; exact typed physical-data mechanism requires tracing |
| Configuration | `parameter` | READY | Data Model Rev 4 section 4.1; count affects loader, not table shape (`SPEC-001`) |
| Configuration | `system_type_parameter` | READY | Data Model Rev 4 section 4.1 |
| Configuration | `parameter_range` | BLOCKED | Data Model Rev 4 section 4.1; `SPEC-002` launch behaviour |
| Alerts | `alert_rule` | PARTIAL | CLAUDE.md section 9 and Data Model Rev 4 section 4.3; routing targets require explicit fields |
| Reports | `report` | BLOCKED | Data Model Rev 4 section 5.1; `SPEC-007` artifact structure |
| Reports | `dispatch` | PARTIAL | Data Model Rev 4 section 5.2; internal recipients blocked by `SPEC-006` |
| Stage 1 support | Standard letters, flags, watchlists, permissions, internal notifications | BLOCKED | `SPEC-008` |

## First Candidate Slice

After the owner rulings, the first ERD slice should cover the minimum dependency chain
needed for clients and branch-scoped access:

`app_user` -> `branch_area` -> `site` -> classification and branch-assignment histories.

It cannot be approved while `SPEC-003`, `SPEC-004`, and `SPEC-005` remain open. Independent
review of `client_group`, `sow`, and other READY entities may continue, but no migration
should be created from a partial diagram.

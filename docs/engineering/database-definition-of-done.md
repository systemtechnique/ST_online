# Database Definition Of Done

**Status: PROPOSED - requires kickoff approval.**

A database task is done only when every applicable item below is satisfied.

## Authority And Scope

- The PR cites the implemented specification sections and approved rulings.
- No affected `FLAG(spec)` question remains unresolved.
- The change matches an approved ERD and API contract.
- No deferred Stage 2 or v2.1 functionality is implemented early.

## Migration Quality

- Every schema change is a new version-controlled migration.
- Previously deployed migrations are not edited.
- Destructive evolution follows expand-and-contract.
- The database builds successfully from empty through the full migration chain.
- Migration order is deterministic and schema-drift validation passes.
- Tables and fields use the ruled singular `snake_case` names.

## Invariants And History

- Foreign keys, `NOT NULL`, checks, and uniqueness constraints enforce critical rules.
- Append-only history permits only the transactional closing write defined in
  `CLAUDE.md` section 4.2.
- Current pointers and history rows change in the same transaction.
- Signed, approved, and generated records lock at their ruled transition.
- Range, SOW, report, and scope snapshots cannot drift after creation.
- Actor and UTC timestamp audit fields exist for approvals and configuration changes.

## Security And Access

- Access is server-side and default-deny.
- Each access rule has an allowed test and a forbidden role/branch test.
- Client-facing paths cannot return internal costs, pipeline data, or internal notes.
- Secrets, credentials, production records, and sensitive values are absent from Git and
  logs.

## Imports And Configuration

- Business values are runtime configuration, not code constants.
- Reference-data loaders are repeatable and idempotent.
- Import rows have stable source identity, validation status, and rejection reasons.
- Re-running a loader or importer cannot create duplicate canonical records.
- Aggregate source, accepted, rejected, and reconciled counts are verified.

## Verification And Evidence

- Formatting, linting, type-checking, tests, and migration validation pass.
- Constraint, history, snapshot, immutability, and transaction tests pass where relevant.
- The PR contains evidence of the acceptance case and failure cases.
- Documentation, ERD, and API contract are updated in the same change when affected.
- The session summary records specifications read, changes, tests, flags, and next task.


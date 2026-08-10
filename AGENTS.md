# ST Online 2.0 Agent Contract

This file applies to every agent working in this repository. It supplements, and does
not replace, `CLAUDE.md`.

## Mandatory Reading

Before changing code, schema, migrations, configuration loaders, or contracts, read:

1. `CLAUDE.md` in full.
2. `docs/specifications/Stage_1_Build_Specification_E1_Rev2.docx`.
3. `docs/specifications/Data_Model_and_Schema_Specification_Rev4.docx`.
4. The task acceptance criteria and any owner rulings recorded for the task.

For parameter or corrective-action work, also read the corresponding specification in
`docs/specifications/`.

## Authority And Flags

Follow the authority order in `CLAUDE.md` section 3. If authoritative documents are
wrong, incomplete, or contradictory, stop only the affected task and record a
`FLAG(spec)` question. Do not resolve it in code, SQL, an ERD, seed data, or a diagram.

## Database Ownership

Only the database track may modify `packages/database`, schema definitions, migrations,
database constraints, or reference-data loaders. Other tracks must propose database
changes through an approved contract and database-track review.

Every database change must:

- cite the specification section and approved ruling it implements;
- be delivered as an immutable, version-controlled migration;
- enforce critical invariants in PostgreSQL, not only in application code;
- include tests for constraints, history, snapshots, and immutability as applicable;
- build successfully from an empty database and pass schema-drift validation.

No production client, contact, credential, or secret data may be committed. Supplied
operational exports remain outside Git and are processed through controlled import and
reconciliation steps.

## Session Summary

Every database-track session ends with a summary of:

- specifications and rulings read;
- files and migrations created or changed;
- verification commands and results;
- unresolved `FLAG(spec)` questions;
- the next independently safe task.

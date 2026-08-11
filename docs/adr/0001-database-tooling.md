# ADR 0001: PostgreSQL-First Database Tooling

- **Status:** APPROVED - technical validation gate pending before ACCEPTED
- **Date:** 2026-08-10
- **Decision owners:** Database track and repository owner
- **Related:** `CLAUDE.md` sections 2, 4, 5, and 11

## Context

The database must enforce append-only history, transactional current pointers, immutable
artifacts, snapshots, default-deny access boundaries, and the SOW full-accounting rule.
The build also requires deterministic migrations from an empty PostgreSQL 18 database
and explicit schema-drift checks.

The migration system must expose PostgreSQL constraints, indexes, types, functions, and
triggers directly. A second declarative ORM schema must not become an authority that can
silently omit or regenerate these database rules.

## Approved Decision

Use:

- `node-pg-migrate` for ordered, immutable migrations;
- `pg` (node-postgres) as the initial runtime PostgreSQL driver;
- TypeScript migration files, with reviewed raw SQL inside migrations where PostgreSQL
  features are clearer or not represented safely by a helper;
- real PostgreSQL 18 for development and tests; do not substitute SQLite;
- one shared connection pool at runtime, with a checked-out client for every explicit
  multi-statement transaction.

Do not introduce an ORM as the schema or migration authority in the initial database
package. A typed query builder may be considered later through a separate ADR if
application query complexity demonstrates the need.

## Approved Pinned Baseline For Validation

These versions are approved for the environment/tooling smoke test. The migration and
driver dependencies are installed only as part of that isolated validation task:

| Component | Candidate |
| --- | --- |
| Node.js | 24.18.1 LTS |
| TypeScript | 6.0.3 |
| pnpm | 11.21.0 |
| PostgreSQL | 18.4; official image digest pinned after first approved pull |
| `node-pg-migrate` | 9.0.0 |
| `pg` | 8.23.0 |

TypeScript 7 remains prohibited by `CLAUDE.md` until an explicit later ADR changes that
ruling.

## Migration Policy

- Use UTC-prefixed migration filenames and enforce migration order checks.
- Run migrations transactionally by default.
- Use the migration tool's advisory lock; concurrent migration runs must fail safely.
- Treat `up` as the shared-environment path. Do not use `down` migrations to rewrite a
  shared database; recovery is a corrective forward migration.
- Never edit a migration after it has run in a shared environment.
- Never auto-run schema synchronization at application startup.
- Never use `synchronize`, `db push`, or an equivalent non-reviewed schema mutation path.
- Review emitted SQL for every migration, including helper-generated statements.
- Keep config/reference-data loaders separate from schema migrations.

## Why This Fits

`node-pg-migrate` is PostgreSQL-focused, supports TypeScript and SQL migrations, runs
migrations in transactions by default, uses an advisory lock, and exposes operations for
constraints, functions, triggers, policies, types, and indexes. `pg` is deliberately
low-level and provides pooling and explicit transaction control. NestJS is database
agnostic and permits direct use of a general-purpose Node database driver.

Primary references:

- <https://salsita.github.io/node-pg-migrate/migrations/>
- <https://salsita.github.io/node-pg-migrate/cli>
- <https://node-postgres.com/features/transactions>
- <https://node-postgres.com/features/pooling>
- <https://docs.nestjs.com/techniques/database>

## Alternatives Considered

### Prisma as schema and migration authority

Not recommended for this database track. Prisma supports PostgreSQL 18, but its own
feature matrix says PostgreSQL `CHECK` and `EXCLUDE` constraints are not represented in
the Prisma schema/migration model, and unsupported features require custom migration SQL.
That would create a split authority between Prisma's model and the ruled PostgreSQL
schema for exactly the invariants this project prioritizes.

References:

- <https://www.prisma.io/docs/orm/reference/database-features>
- <https://www.prisma.io/docs/orm/prisma-schema/data-model/unsupported-database-features>

### TypeORM as schema and migration authority

NestJS integrates with TypeORM, and TypeORM supports migrations. It is not proposed as
the initial schema authority because entity metadata would add a second representation
to keep aligned with handwritten PostgreSQL constraints and triggers. TypeORM's own
documentation requires automatic synchronization to be disabled when using migrations;
the project would prohibit it in every environment.

Reference: <https://typeorm.io/docs/migrations/setup/>

### Unmanaged SQL scripts

Rejected because the project requires ordered migration history, locking, transaction
defaults, and deterministic from-zero execution. Raw SQL remains available inside the
managed migration system without giving up those controls.

## Consequences

- PostgreSQL remains the actual schema authority.
- Complex invariants remain visible and testable in SQL.
- Runtime repositories require explicit mapping and transaction discipline.
- The team does not receive ORM-generated CRUD or relation loading automatically.
- Database types may later be generated from the live migrated schema, but generated
  types cannot become a migration source.

## Approval Gate

The repository owner approved the tooling choice on 2026-08-11 through
`RULING-2026-08-11-010`. Change this ADR to `ACCEPTED` only after the validation below
passes and its evidence is committed.

Before changing this ADR to ACCEPTED:

1. Run a smoke test on Node.js 24 and PostgreSQL 18.
2. Prove create-from-zero, re-run/no-op, migration locking, and corrective-forward flow.
3. Prove one CHECK constraint, one append-only trigger, and one transactional history
   update in an isolated prototype.
4. Confirm the backend track accepts direct `pg` integration or proposes a separate
   query-layer ADR without changing migration authority.

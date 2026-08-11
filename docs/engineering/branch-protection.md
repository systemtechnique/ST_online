# Branch Protection Rules

**Status: APPROVED - implementation pending plan upgrade and second account.**

On 10 August 2026, GitHub rejected the branch-protection API request for this private
repository with HTTP 403: the current account must upgrade to GitHub Pro or make the
repository public. Making the repository public is not acceptable because the
specifications and project material are proprietary. Until the approved upgrade is
purchased and active, the rules below are followed manually and CI evidence is checked
before every merge.

Kamal approved the private-repository plan upgrade and a second independent company
reviewer account on 2026-08-11 (`RULING-2026-08-11-011`). Billing/account execution and
the named reviewer remain pending. The reviewer cannot be the author of the code under
review.

Apply these rules to `main` after the company remote is created:

- Require pull requests; prohibit direct pushes.
- Require at least one approval.
- Require the database CODEOWNER approval for changes under `packages/database`, schema
  definitions, migrations, or reference-data loaders.
- Require conversation resolution before merge.
- Dismiss stale approvals when the reviewed diff changes.
- Require the branch to be up to date before merge.
- Require successful format, lint, type-check, test, migration-from-zero, database
  invariant, and schema-drift checks when those jobs exist.
- Block force pushes and branch deletion.
- Do not allow routine administrator bypass. Emergency bypass must be documented and
  followed by review.
- Keep `main` deployable to staging.

## Review Ownership

- The project owner rules business and specification questions.
- Mohamed is the sole technical delivery owner and reviews schema, migration,
  constraint, history, snapshot, import, backend, frontend, and client-contract effects.
- Non-technical progress review does not replace the required technical owner review.

`@systemtechnique` is the confirmed company technical account and is recorded in
`CODEOWNERS`. A pull-request approval requirement cannot safely be enabled until a
second GitHub identity is confirmed: GitHub does not count a PR author's self-approval,
so requiring one approval with only one participating account would block every merge.

Once the repository plan supports protection, require pull requests and the `quality`
status check but keep required approvals at zero until a second reviewer is confirmed.
Owner business rulings remain mandatory and must be recorded in the repository before
implementation. Once Kamal or the manager has a confirmed GitHub account, enable one
required approval and required CODEOWNER review.


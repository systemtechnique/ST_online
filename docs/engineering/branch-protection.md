# Branch Protection Proposal

**Status: PROPOSED - requires repository-owner approval and confirmed GitHub identities.**

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
- The database-track owner reviews schema, migration, constraint, history, snapshot, and
  import changes.
- The web-track owner reviews frontend and client-contract effects.
- Non-technical progress review does not replace the required technical owner review.

`CODEOWNERS` must not be committed with placeholder accounts. Add it after the repository
owner confirms the exact company GitHub usernames or teams.


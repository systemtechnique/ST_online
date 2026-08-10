# Phase 0 Plan And Exit Gate

Phase 0 establishes the controlled build environment. It does not deliver product
features and does not authorize speculative schema work.

## Completed

- [x] Commit `CLAUDE.md` Revision 4 as the repository's first file.
- [x] Commit the authoritative Stage 1 specification set.
- [x] Commit the Codex/database-track `AGENTS.md` contract.
- [x] Protect operational exports and secrets through `.gitignore`.
- [x] Profile the supplied client, contact, roster, and SOW files without committing PII.
- [x] Record initial specification and import-data questions.
- [x] Configure the private company GitHub remote and publish `main`.
- [x] Configure `CODEOWNERS` for the confirmed `@systemtechnique` account.
- [x] Add the pinned GitHub Actions `quality` workflow and verify its first successful
  pull-request run.
- [x] Track the three first-slice owner rulings as GitHub issues `#2`, `#3`, and `#4`.

## Pending

- [ ] Obtain owner rulings for every ERD-blocking `SPEC-*` question.
- [ ] Receive the completed Users, Roles & Access Questionnaire.
- [ ] Confirm the canonical branch/area roster and initial role holders.
- [ ] Install and verify the complete toolchain. Node.js 24.18.1, pnpm 11.21.0, and
  TypeScript 6.0.3 are ready; Docker and PostgreSQL 18 tooling remain pending.
- [ ] Record the database and migration-tool choice in an ADR.
- [ ] Upgrade the GitHub plan to one that supports branch protection on a private
  repository, then require pull requests and the `quality` check on `main`.
- [ ] Confirm a second GitHub reviewer identity before requiring approvals or CODEOWNER
  review; one participating account cannot approve its own pull request.
- [ ] Approve the ERD process and ERD tool/output format.
- [ ] Approve the API-contract process and ownership boundary.
- [ ] Approve the database Definition of Done.
- [ ] Render and review the first ERD slice directly from Data Model Rev 4 plus rulings.

## Exit Criteria

Phase 0 is complete only when:

1. The authoritative documents and owner rulings are accessible and versioned.
2. No unresolved question blocks the first ERD slice.
3. The pinned local toolchain is installed and verified.
4. Repository protection, review ownership, and required CI checks are active. CI and
   ownership files alone do not satisfy this criterion while GitHub branch protection
   remains unavailable.
5. The ERD process, API-contract process, and database Definition of Done are approved.
6. The first implementation slice and its acceptance criteria are explicitly named.

No migration is created before the affected ERD slice is approved.

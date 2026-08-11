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
- [x] Install and verify Docker Desktop 29.6.2, Docker Compose 5.3.1, WSL2, and the
  official PostgreSQL 18.4 development container.
- [x] Record owner rulings for `SPEC-003`, `SPEC-004`, and `SPEC-005`, unblocking the
  first ERD structure.
- [x] Render the proposed first ERD slice directly from Data Model Rev 4 plus the owner
  rulings.
- [x] Approve the PostgreSQL-first tooling choice, Markdown/Mermaid ERD process, and
  OpenAPI 3.1 contract-first process.
- [x] Approve the private GitHub plan upgrade and a second independent reviewer account.
- [x] Receive owner rulings for parameter counts/ranges, internal notifications,
  immutable artifacts, support-structure sequencing, site identity, login identity,
  and the legacy SOW sample.

## Pending

- [ ] Receive the completed Users, Roles & Access Questionnaire Part 4.
- [ ] Obtain owner rulings for the remaining module-specific `SPEC-*` questions before
  implementing each affected slice.
- [ ] Confirm legacy-area mappings and the detailed access matrix; these block import
  and permission seeds, not the first ERD structure.
- [ ] Complete the database-tooling ADR smoke/constraint validation, then mark it
  `ACCEPTED`.
- [ ] Decide the authentication provider and external-subject representation in a
  technical ADR before authentication implementation.
- [ ] Account/billing owner upgrades GitHub; then enable private branch protection and
  the required `quality` check.
- [ ] Propose and confirm the named second account holder, then require independent
  approval and CODEOWNER review.
- [ ] Send the ERD, database Definition of Done, and workflow copies to Kamal; record his
  final review of each.
- [ ] Receive the formal site address/location field list, update the first ERD, and
  obtain explicit ERD approval before migration.

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

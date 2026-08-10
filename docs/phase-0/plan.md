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

## Pending

- [ ] Obtain owner rulings for every ERD-blocking `SPEC-*` question.
- [ ] Receive the completed Users, Roles & Access Questionnaire.
- [ ] Confirm the canonical branch/area roster and initial role holders.
- [ ] Install and verify Node.js 24 LTS, pinned pnpm, Docker, and PostgreSQL 18 tooling.
- [ ] Record the database and migration-tool choice in an ADR.
- [ ] Configure the company Git remote and confirm repository ownership.
- [ ] Configure branch protection and required status checks on `main`.
- [ ] Configure CODEOWNERS for the database package using confirmed GitHub identities.
- [ ] Approve the ERD process and ERD tool/output format.
- [ ] Approve the API-contract process and ownership boundary.
- [ ] Approve the database Definition of Done.
- [ ] Render and review the first ERD slice directly from Data Model Rev 4 plus rulings.

## Exit Criteria

Phase 0 is complete only when:

1. The authoritative documents and owner rulings are accessible and versioned.
2. No unresolved question blocks the first ERD slice.
3. The pinned local toolchain is installed and verified.
4. Repository protection, review ownership, and required CI checks are active.
5. The ERD process, API-contract process, and database Definition of Done are approved.
6. The first implementation slice and its acceptance criteria are explicitly named.

No migration is created before the affected ERD slice is approved.


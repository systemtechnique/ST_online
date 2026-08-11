# Phase 0 Owner Review Request - 2026-08-11

**Status: READY TO SEND.**

This record tracks the three review copies Kamal requested before final Phase 0
confirmation. The repository files remain the source of truth; emailed copies are
read-only review exports.

## Review Files

1. `docs/erd/stage-1-slice-1.md`
   - Requested outcome: explicit ERD approval or itemized flags.
   - Current status: proposed for review; no migration authorized.
2. `docs/engineering/database-definition-of-done.md`
   - Requested outcome: confirm the mandatory invariant tests and grant final approval.
   - Current status: approved in principle.
3. `docs/preliminary-workflow.md`
   - Requested outcome: confirm authority/flag discipline and per-stage business
     acceptance, then grant final approval.
   - Current status: approved in principle.

## Second Reviewer Proposal

Propose Kamal as the holder of the second company GitHub account. He is independent of
Mohamed's authorship and already owns specification, ERD, and business acceptance
decisions. The account must be company-owned and must not share credentials with the
author account. The exact GitHub username requires Kamal's confirmation before updating
`CODEOWNERS` or enabling required reviews.

## GitHub Plan Execution

The private-repository plan upgrade is approved but not yet purchased. The company
billing owner must complete the upgrade in GitHub. Do not make the repository public.
After the upgrade, enable the approved protection rules and verify them with a test pull
request before treating repository protection as complete.

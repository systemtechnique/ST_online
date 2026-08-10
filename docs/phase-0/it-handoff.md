# Phase 0 IT Handoff

This checklist contains the remaining workstation and company-service actions that need
IT ownership or approval.

## Workstation Container Runtime

Current finding: WSL is not installed, Docker is not installed, and system virtualization
details were not available to the non-administrator session.

IT actions:

1. Confirm hardware virtualization is enabled in firmware.
2. Enable the Windows features required for WSL2 and the approved container runtime.
3. Install WSL2 and its kernel updates.
4. Install the company-approved Docker Desktop/runtime under the correct company license.
5. Confirm Docker starts after reboot without requiring a personal account.
6. Confirm this user can run Linux containers without local-administrator elevation for
   every command.

Acceptance commands:

```powershell
wsl.exe --status
docker --version
docker compose version
docker run --rm hello-world
```

After acceptance, the database track will pull `postgres:18.4`, record the official image
digest, start the service in `compose.yaml`, and run the database-tooling ADR smoke test.

## Company Git Repository

Current finding: the local Git repository has no remote.

IT/repository-owner actions:

1. Create the private company repository.
2. Confirm the repository owner and billing plan.
3. Provide the HTTPS or SSH remote URL.
4. Provide the exact company GitHub usernames/teams for the database owner, web owner,
   project owner, and progress reviewer.
5. Confirm the required company authentication method and secret storage.
6. Approve the branch-protection proposal.

After identities are confirmed, add `CODEOWNERS`; do not commit placeholder owners.

Acceptance checks:

```powershell
git remote -v
git ls-remote origin
```

The repository must remain private. Operational exports, client contacts, SOW samples,
credentials, and generated artifacts must never be pushed.

## Production PostgreSQL

Managed PostgreSQL remains the default. IT must provide either:

- the approved managed provider, region, production owner, backup/retention settings,
  restore-test process, encryption, monitoring, and access path; or
- a written pass/fail assessment showing that the ST server meets the production-hosting
  checklist.

No production credential is placed in Git, a document, a ticket comment, or application
logs.

## External Service Accounts

Confirm company ownership and administrators for:

- GitHub;
- managed PostgreSQL;
- object storage for immutable reports and signed SOW scans;
- central email sending;
- WhatsApp Business Platform and the central number;
- approved AI development and code-review services.

Access should use named company identities, least privilege, and a recoverable company
administrator rather than a developer's personal account.


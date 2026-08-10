# API Contract Process

**Status: PROPOSED - requires kickoff approval.**

The API contract is the shared boundary between the database/backend track and the web
track. Neither track changes that boundary unilaterally.

## Contract Source

- OpenAPI 3.1 is the proposed machine-readable contract format.
- The committed contract is authoritative for endpoint shape; business behaviour remains
  authoritative in the Stage 1 specifications and owner rulings.
- Database table names and internal fields are not exposed automatically as API fields.
- Issues track delivery work and never outrank the approved contract or specifications.

## Change Sequence

1. Name the specification section and acceptance criteria.
2. Resolve every affected `FLAG(spec)` question.
3. Propose the OpenAPI change before backend or frontend implementation.
4. Obtain database-track review for persistence, constraints, snapshots, and transaction
   boundaries.
5. Obtain web-track review for client usability and compatibility.
6. Add allowed and forbidden authorization examples.
7. Merge the contract, then implement both sides against it.
8. Run contract and integration tests before the implementation PR is complete.

## Required Endpoint Detail

Every operation defines:

- request and response schemas, including required and nullable fields;
- stable identifiers and enum values;
- default-deny authorization and branch/site scope;
- validation rules that are also database invariants where applicable;
- standard error codes and a safe error body with no secret/internal leakage;
- UTC timestamps and Egypt-local calendar dates where the domain requires them;
- pagination, filtering, and deterministic ordering for collection endpoints;
- idempotency keys for report generation, email, WhatsApp, and other side effects;
- concurrency or version checks for mutable drafts and configuration;
- examples for success, validation failure, forbidden access, conflict, and retry.

## Compatibility

- Additive optional fields are normally non-breaking.
- Removing or renaming a field, changing meaning, narrowing accepted input, or changing
  authorization is breaking and requires an explicit migration/deprecation plan.
- Generated clients and server types must come from the committed contract once tooling
  is selected; duplicated handwritten models are not a second source of truth.


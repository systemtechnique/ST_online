# Open Specification And Data Questions

This register records questions that must not be resolved by implementation assumption.
The affected work remains stopped until an owner ruling is recorded. Source documents
remain unchanged.

## Specification Questions

### SPEC-001: Parameter count

- **Status:** OPEN
- **Sources:** Data Model Rev 4 section 4; Stage 1 E1 section 16.1; Parameter Specification Rev 2 Purpose and Revision History.
- **Conflict:** Data Model Rev 4 and E1 state 127 parameters. Parameter Specification Rev 2 states 128 after its Rev 2 additions/removal.
- **Question:** What is the authoritative Stage 1 parameter count and config-load row set?
- **Blocks:** Parameter reference-data loader acceptance checks.

### SPEC-002: Water-source-specific ranges at launch

- **Status:** OPEN
- **Sources:** Data Model Rev 4 section 4.1; Stage 1 E1 section 16.3; Parameter Specification Rev 2 Design Principle 2 and Part C.
- **Conflict:** Data Model Rev 4 and E1 launch Mains Water with one range set while retaining dormant source-set structure. Parameter Specification Rev 2 says readings use the range matching the unit's water source.
- **Question:** Does Stage 1 apply one shared Mains Water range set or source-specific ranges?
- **Blocks:** `parameter_range` activation rules and reading range selection.

### SPEC-003: Greenfield representation

- **Status:** RESOLVED by `RULING-2026-08-10-001` (GitHub issue `#2`).
- **Sources:** Data Model Rev 4 sections 1.2 and 7; Stage 1 E1 sections 2.1 and 2.5.
- **Conflict:** Data Model Rev 4 treats `GREENFIELD` as a market-classification value. E1 describes a separate Greenfield/Operating `market_status`, with C/ANC/PC/Excluded applying after opening.
- **Question:** Must the ERD use one classification axis or separate operating-status and market-classification fields?
- **Blocks:** `site`, classification history, and TOH constraints.

### SPEC-004: Canonical branch structure

- **Status:** RESOLVED by `RULING-2026-08-10-002` (GitHub issue `#3`).
- **Sources:** Stage 1 E1 section 1; Branch & User Roster dated 6 August 2026.
- **Conflict:** E1 separates Alexandria and North Coast and names Upper Egypt (Luxor/Aswan). The roster combines Alex + Sahel and names Luxor as a branch.
- **Question:** What branch/area structure should the ERD and initial data use?
- **Blocks:** Branch seed data, access scoping, and branch-derived SOW approvals.

### SPEC-005: Extensible and multiple roles

- **Status:** RESOLVED by `RULING-2026-08-10-003` (GitHub issue `#4`).
- **Sources:** Data Model Rev 4 `app_user`; Users, Roles & Access Questionnaire Rev 3 Parts 3 and 4.
- **Conflict:** Data Model Rev 4 defines one fixed enum role per `app_user`. The questionnaire describes OM-created office roles and asks about dual-role users.
- **Question:** Is one fixed role per user the intended Stage 1 model, or must roles and permissions be configurable and many-to-many?
- **Blocks:** Auth schema and default-deny authorization contracts.

### SPEC-006: Internal SOW notification recipients

- **Status:** OPEN
- **Sources:** Data Model Rev 4 sections 1.3 and 5.2; Stage 1 E1 SOW approval chain.
- **Conflict:** AN and the Hospitality Financial Manager are internal `app_user` recipients, while the defined `dispatch` recipient is a client `contact`.
- **Question:** How are internal notifications represented without mixing internal users with client report recipients?
- **Blocks:** SOW approval notifications and notification audit records.

### SPEC-007: Immutable report artifact structure

- **Status:** OPEN
- **Sources:** CLAUDE.md sections 4.3 and 4.13; Data Model Rev 4 section 5.1.
- **Gap:** Reports require immutable bilingual artifacts, byte-for-byte retrieval, versioning, and checksums. The defined `report` fields do not identify object storage, checksum, content type, size, or language variants.
- **Question:** Will an artifact entity/field set be issued, or should it be proposed through the ERD process?
- **Blocks:** Final report and artifact-storage schema. It does not block an isolated PDF rendering proof.

### SPEC-008: Stage 1 structures not defined in the entity reference

- **Status:** OPEN
- **Sources:** Stage 1 E1 sections 12 and 21; CLAUDE.md section 9; Data Model Rev 4 entity definitions.
- **Gap:** Stage 1 requires standard letters, daily flags, the SL watchlist, internal notifications, and access permissions, but their table structures are not defined in Data Model Rev 4.
- **Question:** Will a later Data Model revision define these structures, or should each be proposed and ruled during the ERD process?
- **Blocks:** The affected Stage 1 modules, not unrelated core entities.

### SPEC-009: Detailed access matrix

- **Status:** OPEN
- **Sources:** CLAUDE.md section 4.8; Users, Roles & Access Questionnaire Rev 3 Part 4;
  `RULING-2026-08-10-003`.
- **Gap:** The role structure is ruled, but the questionnaire's eleven access decisions
  remain blank, including cross-branch SL exceptions and Sales, Lab, Finance, Admin,
  delegation, and user-administration permissions.
- **Question:** What is the completed Stage 1 access matrix for every system and
  configurable office role?
- **Blocks:** Permission reference data and the final authorization contract. It does
  not block the normalized role/permission ERD structure.

### SPEC-010: Site identity fields

- **Status:** OPEN
- **Sources:** Data Model Rev 4 section 1.2 `site`; Stage 1 E1 section 2; supplied client
  export.
- **Gap:** The `site` entity has no name, operational/external identifier, address or
  location fields, or active-state field. A property cannot be created, selected, or
  reconciled safely with only the fields currently listed.
- **Question:** What is the authoritative Stage 1 site identity and location field set,
  including the treatment of the legacy Client Code?
- **Blocks:** Approval and migration of `site`; overlaps `DATA-001` for import mapping.

### SPEC-011: Application-user authentication identity

- **Status:** OPEN
- **Sources:** CLAUDE.md sections 4.8 and 6 step 1; Data Model Rev 4 section 1.1
  `app_user`.
- **Gap:** `app_user` defines a display name, branch, and active state but no login
  identifier, email, or external identity-provider subject.
- **Question:** What authentication provider and immutable login identifier must Stage 1
  store for an application user?
- **Blocks:** Approval and migration of `app_user` and the authentication contract. It
  does not block review of reporting-line or role cardinality.

## Supplied-Data Questions

### DATA-001: Client external identifier

- **Status:** OPEN
- **Evidence:** Client export contains 452 rows, 75 blank client codes, and code `1401010001` assigned to two different clients.
- **Question:** Is Client Code an ERP identifier, must it be unique, and may it be null?
- **Blocks:** Client import keys and ERP reconciliation.

### DATA-002: Property-type and Stage 1 scope mapping

- **Status:** OPEN
- **Evidence:** Export types include Hotel, Factory, Other, Boat, Club House, Company, Residential compound, School, Mall, and Hospital. The export includes 48 Industrial-branch clients.
- **Question:** What canonical property type maps to each legacy value, and are Industrial records excluded from the Stage 1 load?
- **Blocks:** Client import transformation.

### DATA-003: Water-source mapping

- **Status:** OPEN
- **Evidence:** Export values are RO, City Water, and Nile Water. The specification discusses Municipal, RO, Well, and Desalination.
- **Question:** What canonical launch value maps to each legacy source, especially Nile Water?
- **Blocks:** Site/system water-source import.

### DATA-004: Legacy areas versus management units

- **Status:** OPEN
- **Evidence:** The client export contains many areas, but the roster supplies SL and Branch Accountant assignments only for its six branches.
- **Question:** Which legacy areas become `branch_area` management units, and who is the SL and Branch Accountant for each?
- **Blocks:** Area seeds and branch-scoped authorization.

### DATA-005: Contact reconciliation and report recipients

- **Status:** OPEN
- **Evidence:** The contact export contains 1,668 rows across about 890 names; 758 rows have no normalized exact match in the 452-row client export. It also contains TO/CC/BCC values, 558 blank emails, 122 rows with neither email nor mobile, and four malformed-looking emails.
- **Question:** Which unmatched contacts are current, how are they linked to canonical sites, and must TO/CC/BCC be preserved beyond `is_report_recipient`?
- **Blocks:** Contact and dispatch-recipient import.

### DATA-006: Legacy SOW sample purpose

- **Status:** OPEN
- **Evidence:** `STSOW.pdf` includes internal costs and profitability, states a fixed monthly visit count, and lacks the new approval chain, catch-all exclusion clause, revision identifier, and complete recipient email.
- **Question:** Is this an internal approval SOW, a client-facing SOW, or only a legacy data sample? Which fields should be retained in each new SOW view/artifact?
- **Blocks:** SOW import mapping and final template; it does not block the SOW engine model once structural rulings are settled.

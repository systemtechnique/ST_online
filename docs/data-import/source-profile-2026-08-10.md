# Direct-Supply Data Source Profile

This is an aggregate profile only. No client names, contacts, phone numbers, email
addresses, or source records are committed. The source files remain outside Git.

The row, column, blank-key, duplicate-key, and source-hash results were independently
reproduced by the tested TypeScript CLI in `tools/data-profiler` on 2026-08-10.

## Source Manifest

| Source file | Bytes | SHA-256 |
| --- | ---: | --- |
| `Client6-8-2026 (1).xls` | 109490 | `8EA767072CE59E85FA18D5CDC990BC6714ADB057F6F6188029C20DF460B95B5C` |
| `Product6-8-2026.xls` | 473625 | `B22810EB5DBEFE3D0C4574B611FB8ACEF20AD13F085E25705AE235DEEB8503E3` |
| `ST_Online_2_Branch_User_Roster_for_Gouda.docx` | 26593 | `CA3A920B3084B337C3E0580375E7910BF4DA5AA88111D26BA15D5DF278520B8C` |
| `STSOW.pdf` | 238360 | `2E3A062061F835CAD140DA5371ACCA560ADF2C3E853933B628A4761D77C109F4` |

The two `.xls` files are HTML table exports with misleading extensions, not native
Excel workbooks. Import tooling must parse them as HTML or convert them through a
controlled preprocessing step.

## Client Export

- 452 rows and 446 normalized unique client names.
- 75 rows have no client code.
- One client code is assigned to two different rows.
- Four normalized client names are duplicated.
- The `Active` field is blank on all 452 rows.
- Branch counts: Hurghada 109, Cairo 102, Sharm El Sheikh 63, Marsa Alam 51,
  Industrial 48, Alexandria 40, Upper Egypt 39.
- Property types require canonical mapping; Industrial records require a Stage 1 scope
  ruling.
- Water-source values are RO, City Water, and Nile Water and require canonical mapping.

## Contact Export

- Despite its filename, `Product6-8-2026.xls` contains client contacts, not products.
- 1,668 contact rows across about 890 normalized client names.
- 758 rows, covering 467 normalized names, have no exact normalized match in the client
  export.
- 558 rows have no email address.
- 122 rows have neither an email address nor either mobile number.
- Four email values are malformed by basic syntax checks.
- Two duplicate contact records were detected after normalized comparison.
- Every row is marked active.
- Recipient types are TO, CC, and BCC; mapping to the ruled report-recipient model is
  unresolved.

## Roster And SOW

- The roster supplies six branches and named SL/Branch Accountant holders but no
  assignments for the legacy areas present in the client export.
- The roster branch structure conflicts with the Stage 1 E1 branch structure; see
  `SPEC-004` and `DATA-004` in the open-question register.
- The SOW sample maps to an existing client and contact in the supplied exports.
- It is a legacy artifact and is not a final Stage 1 template. Its intended internal or
  client-facing role remains unresolved; see `DATA-006`.

## Import Gate

No source row may enter production tables directly. The controlled path is:

1. Preserve and hash the immutable raw source outside Git.
2. Parse into staging records without business transformation.
3. Produce reconciliation results for identifiers, names, branches, types, sources, and
   recipients;
4. apply only approved mappings to a canonical data set;
5. load through a repeatable, idempotent importer with row-level rejection reasons;
6. verify counts and referential integrity before promotion.

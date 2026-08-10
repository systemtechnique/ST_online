# Data Profiler

This internal CLI profiles legacy HTML-table exports without emitting source row values.
It is suitable for the supplied files that use an `.xls` extension but contain HTML.

The JSON output contains:

- source SHA-256;
- row and column counts;
- column names;
- blank and distinct-non-blank counts per column;
- optional duplicate-key counts without duplicate values.

It does not write an output file and does not emit cell values.

## Build And Test

From the repository root:

```powershell
.\scripts\pnpm-local.cmd typecheck
.\scripts\pnpm-local.cmd test
.\scripts\pnpm-local.cmd build
```

## Profile A Source Outside Git

```powershell
.\scripts\node-local.cmd tools\data-profiler\dist\src\cli.js `
  C:\path\to\source.xls `
  --duplicate-key "External ID"
```

Redirecting output to a file should be done only in an approved, access-controlled
location outside Git. The output is aggregate, but the source hash and structure remain
proprietary project metadata.


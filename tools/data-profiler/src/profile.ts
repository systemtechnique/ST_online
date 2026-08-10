import { createHash } from 'node:crypto';

import type { ParsedTable } from './html-table.js';

export interface ColumnProfile {
  name: string;
  blankCount: number;
  distinctNonBlankCount: number;
}

export interface DuplicateKeyProfile {
  column: string;
  blankCount: number;
  duplicateGroupCount: number;
  duplicateRowCount: number;
}

export interface TableProfile {
  sha256: string;
  rowCount: number;
  columnCount: number;
  columns: ColumnProfile[];
  duplicateKey?: DuplicateKeyProfile;
}

export function profileTable(
  source: Buffer,
  table: ParsedTable,
  duplicateKeyColumn?: string,
): TableProfile {
  const columns = table.headers.map((name, index) => {
    const values = table.rows.map((row) => row[index] ?? '');
    const nonBlank = values.filter((value) => value.length > 0);

    return {
      name,
      blankCount: values.length - nonBlank.length,
      distinctNonBlankCount: new Set(nonBlank.map((value) => value.toLocaleLowerCase('en')))
        .size,
    };
  });

  const profile: TableProfile = {
    sha256: createHash('sha256').update(source).digest('hex').toUpperCase(),
    rowCount: table.rows.length,
    columnCount: table.headers.length,
    columns,
  };

  if (duplicateKeyColumn !== undefined) {
    const keyIndex = table.headers.indexOf(duplicateKeyColumn);
    if (keyIndex === -1) {
      throw new Error(`Duplicate-key column not found: ${duplicateKeyColumn}`);
    }

    const counts = new Map<string, number>();
    let blankCount = 0;

    for (const row of table.rows) {
      const value = row[keyIndex] ?? '';
      if (value.length === 0) {
        blankCount += 1;
        continue;
      }

      const normalized = value.toLocaleLowerCase('en');
      counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    }

    const duplicateCounts = [...counts.values()].filter((count) => count > 1);
    profile.duplicateKey = {
      column: duplicateKeyColumn,
      blankCount,
      duplicateGroupCount: duplicateCounts.length,
      duplicateRowCount: duplicateCounts.reduce((total, count) => total + count - 1, 0),
    };
  }

  return profile;
}


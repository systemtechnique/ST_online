import assert from 'node:assert/strict';
import test from 'node:test';

import { parseFirstHtmlTable } from '../src/html-table.js';
import { profileTable } from '../src/profile.js';

const fixture = Buffer.from(`
  <div>
    <table>
      <tr><th>External ID</th><th>Branch</th><th>Active</th></tr>
      <tr><td>A-001</td><td>North</td><td>True</td></tr>
      <tr><td>A-001</td><td> North </td><td>&nbsp;</td></tr>
      <tr><td>&nbsp;</td><td>South</td><td>False</td></tr>
    </table>
  </div>
`);

test('parses an exported HTML table and normalizes whitespace', () => {
  const table = parseFirstHtmlTable(fixture.toString('utf8'));

  assert.deepEqual(table.headers, ['External ID', 'Branch', 'Active']);
  assert.deepEqual(table.rows, [
    ['A-001', 'North', 'True'],
    ['A-001', 'North', ''],
    ['', 'South', 'False'],
  ]);
});

test('returns aggregate counts without exposing source values', () => {
  const table = parseFirstHtmlTable(fixture.toString('utf8'));
  const profile = profileTable(fixture, table, 'External ID');

  assert.equal(profile.rowCount, 3);
  assert.equal(profile.columnCount, 3);
  assert.deepEqual(profile.columns, [
    { name: 'External ID', blankCount: 1, distinctNonBlankCount: 1 },
    { name: 'Branch', blankCount: 0, distinctNonBlankCount: 2 },
    { name: 'Active', blankCount: 1, distinctNonBlankCount: 2 },
  ]);
  assert.deepEqual(profile.duplicateKey, {
    column: 'External ID',
    blankCount: 1,
    duplicateGroupCount: 1,
    duplicateRowCount: 1,
  });
  assert.equal(JSON.stringify(profile).includes('A-001'), false);
  assert.equal(JSON.stringify(profile).includes('North'), false);
});

test('rejects a duplicate-key column that does not exist', () => {
  const table = parseFirstHtmlTable(fixture.toString('utf8'));

  assert.throws(
    () => profileTable(fixture, table, 'Missing'),
    /Duplicate-key column not found: Missing/,
  );
});

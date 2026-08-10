import { readFile } from 'node:fs/promises';

import { parseFirstHtmlTable } from './html-table.js';
import { profileTable } from './profile.js';

function usage(): never {
  throw new Error('Usage: data-profiler <html-table-file> [--duplicate-key <column>]');
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const inputPath = args[0];
  if (!inputPath) {
    usage();
  }

  let duplicateKey: string | undefined;
  if (args.length > 1) {
    if (args[1] !== '--duplicate-key' || !args[2] || args.length !== 3) {
      usage();
    }
    duplicateKey = args[2];
  }

  const source = await readFile(inputPath);
  const html = source.toString('utf8');
  const table = parseFirstHtmlTable(html);
  const profile = profileTable(source, table, duplicateKey);
  process.stdout.write(`${JSON.stringify(profile, null, 2)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown data-profiler error';
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});


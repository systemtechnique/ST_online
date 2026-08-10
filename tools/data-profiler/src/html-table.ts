import { parseFragment } from 'parse5';
import type { DefaultTreeAdapterMap } from 'parse5';

type Node = DefaultTreeAdapterMap['node'];
type Element = DefaultTreeAdapterMap['element'];

export interface ParsedTable {
  headers: string[];
  rows: string[][];
}

function isElement(node: Node): node is Element {
  return 'tagName' in node;
}

function normalizeText(value: string): string {
  return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function textContent(node: Node): string {
  if ('value' in node) {
    return node.value;
  }

  if ('childNodes' in node) {
    return node.childNodes.map(textContent).join('');
  }

  return '';
}

function findFirstElement(node: Node, tagName: string): Element | undefined {
  if (isElement(node) && node.tagName === tagName) {
    return node;
  }

  if (!('childNodes' in node)) {
    return undefined;
  }

  for (const child of node.childNodes) {
    const match = findFirstElement(child, tagName);
    if (match) {
      return match;
    }
  }

  return undefined;
}

function findElements(node: Node, tagName: string, output: Element[]): void {
  if (isElement(node) && node.tagName === tagName) {
    output.push(node);
  }

  if ('childNodes' in node) {
    for (const child of node.childNodes) {
      findElements(child, tagName, output);
    }
  }
}

function cellsForRow(row: Element): string[] {
  return row.childNodes
    .filter(
      (node): node is Element =>
        isElement(node) && (node.tagName === 'th' || node.tagName === 'td'),
    )
    .map((cell) => normalizeText(textContent(cell)));
}

export function parseFirstHtmlTable(html: string): ParsedTable {
  const document = parseFragment(html);
  const table = findFirstElement(document, 'table');

  if (!table) {
    throw new Error('No HTML table was found in the supplied file.');
  }

  const rowElements: Element[] = [];
  findElements(table, 'tr', rowElements);
  const rows = rowElements.map(cellsForRow).filter((row) => row.length > 0);

  if (rows.length === 0) {
    throw new Error('The first HTML table contains no rows.');
  }

  const headers = rows[0];
  if (!headers || headers.length === 0 || headers.some((header) => header.length === 0)) {
    throw new Error('The first HTML table must have a non-blank header row.');
  }

  if (new Set(headers).size !== headers.length) {
    throw new Error('The first HTML table contains duplicate column headers.');
  }

  const dataRows = rows.slice(1).map((row) =>
    headers.map((_, index) => row[index] ?? ''),
  );

  return { headers, rows: dataRows };
}


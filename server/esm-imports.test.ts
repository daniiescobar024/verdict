import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Vercel runs `api/*.ts` as native Node ESM without bundling, and Node refuses
 * extensionless relative imports. Vite doesn't care, so this would only break in
 * production — this test walks the server import graph and catches it in CI.
 */
const RELATIVE_IMPORT = /^\s*import\s+(?!type\b)[^'"]*from\s+'(\.{1,2}\/[^']+)'/gm;

function collect(file: string, seen = new Set<string>()): string[] {
  if (seen.has(file)) return [];
  seen.add(file);
  const problems: string[] = [];
  for (const [, specifier] of readFileSync(file, 'utf8').matchAll(RELATIVE_IMPORT)) {
    if (!specifier) continue;
    if (!specifier.endsWith('.js')) {
      problems.push(`${file} → '${specifier}'`);
      continue;
    }
    collect(resolve(dirname(file), specifier.replace(/\.js$/, '.ts')), seen).forEach((p) =>
      problems.push(p),
    );
  }
  return problems;
}

describe('serverless import graph', () => {
  it('uses explicit .js extensions for every runtime relative import', () => {
    expect(collect(resolve(__dirname, '../api/audit.ts'))).toEqual([]);
  });
});

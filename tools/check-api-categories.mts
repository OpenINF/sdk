/**
 * @file Hold the API reference's categories to one list, and leave nothing out.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} tools/check-api-categories
 */

// TypeDoc files a declaration under the heading its `@category` tag names,
// matched as an exact string. Two consequences follow, and neither is visible
// until someone reads the generated page.
//
// A tag spelled slightly differently makes a second heading beside the first:
// `Fundamental Object` next to `Fundamental Objects`. So every tag must name
// one of the categories in `api-categories.mts`, which are sections of the
// ECMAScript specification.
//
// And once a package categorizes anything, whatever it does not categorize is
// listed under `Other`, which says nothing about what is there. So in such a
// package, everything the entry point exports must carry a category. A package
// that categorizes nothing is listed by kind -- classes, functions, types --
// and is left to do so.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

import {
  categoryProblem,
  categoryStateOf,
  categoryTagsIn,
} from './api-categories.mts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const failures: string[] = [];

function relative(file: string, position?: number, source?: ts.SourceFile) {
  const name = path.relative(ROOT, file);

  if (position === undefined || source === undefined) return name;
  return `${name}:${source.getLineAndCharacterOfPosition(position).line + 1}`;
}

/** Every TypeScript source in a package, private helpers included. */
function sources(directory: string): string[] {
  return fs
    .readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

/** The tags TypeDoc leaves a declaration off the reference for. */
const UNPUBLISHED = new Set(['hidden', 'ignore', 'private']);

function isPublished(declaration: ts.Declaration): boolean {
  return !ts
    .getJSDocTags(declaration)
    .some((tag) => UNPUBLISHED.has(tag.tagName.text));
}

const packages = fs
  .readdirSync(path.join(ROOT, 'packages'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(ROOT, 'packages', entry.name))
  .filter((directory) =>
    fs.existsSync(path.join(directory, 'src', 'index.ts'))
  );

for (const directory of packages) {
  const src = path.join(directory, 'src');

  // A misspelled tag is wrong wherever it is, including in a private helper
  // that is one export away from being published. The value is the one
  // TypeScript parses, so a value on the line after the tag is checked, and a
  // tag with no value at all is caught rather than silently dropped.
  for (const file of sources(src)) {
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true
    );

    for (const tag of categoryTagsIn(source)) {
      const problem = categoryProblem(tag.value);
      if (problem) failures.push(`${relative(file)}:${tag.line}  ${problem}`);
    }
  }

  const configFile = path.join(directory, 'tsconfig.build.json');
  const config = ts.getParsedCommandLineOfConfigFile(
    configFile,
    {},
    { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} }
  );

  if (config === undefined) {
    failures.push(`${relative(configFile)}  could not be read`);
    continue;
  }

  const entryPoint = path.join(src, 'index.ts');
  const program = ts.createProgram([entryPoint], {
    ...config.options,
    noEmit: true,
  });
  const checker = program.getTypeChecker();
  const entry = program.getSourceFile(entryPoint);
  const module = entry && checker.getSymbolAtLocation(entry);

  if (module === undefined) {
    failures.push(`${relative(entryPoint)}  has no exports to check`);
    continue;
  }

  const missing: string[] = [];
  let categorized = 0;

  for (const exported of checker.getExportsOfModule(module)) {
    const symbol =
      exported.flags & ts.SymbolFlags.Alias
        ? checker.getAliasedSymbol(exported)
        : exported;

    // Declared in another workspace package and reexported here. That
    // package's own run checks it, against its own source.
    const declarations = (symbol.declarations ?? []).filter((declaration) =>
      path
        .resolve(declaration.getSourceFile().fileName)
        .startsWith(src + path.sep)
    );

    if (declarations.length === 0 || !declarations.some(isPublished)) continue;

    const state = categoryStateOf(declarations);

    // An invalid tag is already reported where it is written.
    if (state === 'valid') {
      categorized += 1;
    } else if (state === 'missing') {
      const [first] = declarations;
      const source = first!.getSourceFile();
      missing.push(
        `${relative(source.fileName, first!.getStart(source), source)}  ${exported.name} has no @category, so it is listed under "Other"`
      );
    }
  }

  if (categorized > 0) failures.push(...missing);
}

if (failures.length > 0) {
  process.stderr.write(`${failures.join('\n')}\n`);
  process.exit(1);
}

process.stdout.write(
  'Every category is on the list, and nothing is left under "Other".\n'
);

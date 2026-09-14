/**
 * @file Require every published guard to say what it expects.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} tools/check-guard-expectations
 */

// A guard is a function that takes any value and narrows it: `(value:
// unknown): value is X`. Handed to `assertValue`, a failing guard is reported
// with its `expectation`, as in "Expected value to be a Date object". A guard
// without one still works, but the failure then says "Expected value to be
// valid", which names nothing.
//
// Nothing in the type system notices a missing expectation, because it is
// assigned after the function is declared. So the declarations are read for
// the functions that are guards by their signature, and the built packages are
// asked whether each one carries an expectation. A function that returns a
// plain `boolean`, or that only accepts a narrower type than `unknown`, is not
// a guard by this definition, because TypeScript will not accept it as one, so
// it is not held to this.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

/** A guard found in a source file, and where to point at it. */
interface Found {
  name: string;
  file: string;
  line: number;
}

/** The TypeScript sources of one package, private helpers left out. */
function sources(src: string): string[] {
  const found: string[] = [];
  const walk = (directory: string) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        if (entry.name !== '_internal') walk(full);
      } else if (entry.name.endsWith('.ts')) {
        found.push(full);
      }
    }
  };

  walk(src);
  return found;
}

function isExported(node: ts.Node): boolean {
  return (
    ts.canHaveModifiers(node) &&
    (ts.getModifiers(node) ?? []).some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
    )
  );
}

/** Whether a signature takes one `unknown` and narrows it, not asserts it. */
function isGuardSignature(signature: ts.SignatureDeclaration): boolean {
  const parameters = signature.parameters.filter(
    (parameter) => parameter.name.getText() !== 'this'
  );
  const returns = signature.type;

  return (
    parameters.length === 1 &&
    parameters[0]?.type?.kind === ts.SyntaxKind.UnknownKeyword &&
    returns !== undefined &&
    ts.isTypePredicateNode(returns) &&
    returns.assertsModifier === undefined
  );
}

/** The exported guards declared in one file. */
function guardsIn(file: string): Found[] {
  const text = fs.readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const found: Found[] = [];
  const at = (node: ts.Node) =>
    source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;

  for (const statement of source.statements) {
    if (!isExported(statement)) continue;

    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name &&
      isGuardSignature(statement)
    ) {
      found.push({ name: statement.name.text, file, line: at(statement) });
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        const initializer = declaration.initializer;

        if (
          ts.isIdentifier(declaration.name) &&
          initializer &&
          (ts.isArrowFunction(initializer) ||
            ts.isFunctionExpression(initializer)) &&
          isGuardSignature(initializer)
        ) {
          found.push({
            name: declaration.name.text,
            file,
            line: at(declaration),
          });
        }
      }
    }
  }

  return found;
}

function hasExpectation(value: unknown): boolean {
  const expectation = (value as { expectation?: unknown }).expectation;

  if (typeof expectation === 'function') return true;
  return typeof expectation === 'string' && expectation.trim() !== '';
}

const failures: string[] = [];
let checked = 0;

for (const entry of fs.readdirSync(path.join(ROOT, 'packages'), {
  withFileTypes: true,
})) {
  const directory = path.join(ROOT, 'packages', entry.name);
  const src = path.join(directory, 'src');

  if (!entry.isDirectory() || !fs.existsSync(src)) continue;

  const manifest = require(path.join(directory, 'package.json')) as {
    main?: string;
  };

  if (!manifest.main) continue;

  const entryPoint = path.join(directory, manifest.main);

  if (!fs.existsSync(entryPoint)) {
    process.stderr.write(
      `${path.relative(ROOT, entryPoint)} does not exist; run \`pnpm run build\` first.\n`
    );
    process.exit(1);
  }

  const exports = require(entryPoint) as Record<string, unknown>;

  for (const guard of sources(src).flatMap(guardsIn)) {
    const value = exports[guard.name];

    // Declared but not reexported from the barrel, so nobody outside the
    // package can pass it to an assertion.
    if (typeof value !== 'function') continue;

    checked += 1;

    if (!hasExpectation(value)) {
      failures.push(
        `${path.relative(ROOT, guard.file)}:${guard.line}  ${guard.name} has no expectation, so a failed assertion would read "to be valid"`
      );
    }
  }
}

if (failures.length > 0) {
  process.stderr.write(`${failures.join('\n')}\n`);
  process.exit(1);
}

process.stdout.write(`${checked} guards, each with an expectation.\n`);

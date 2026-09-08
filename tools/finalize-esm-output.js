#!/usr/bin/env node

// tsc's ESM build (module: es2015) emits plain .js/.d.ts files with
// relative import/export specifiers left bare (e.g. `from './guards/x'`).
// Node's ESM loader, unlike CommonJS `require`, refuses to resolve
// extensionless relative specifiers, so that output is unloadable as-is.
//
// This rewrites a tsc ESM output directory in place so it's directly
// importable: relative specifiers get an explicit .mjs (or .d.mts, inside
// declaration files) appended, and every file is renamed to match
// (.js -> .mjs, .d.ts -> .d.mts, plus their .map siblings). The .mjs/.d.mts
// extensions are unambiguous to Node/TypeScript by themselves, so no
// dist/esm/package.json "type" marker is needed.
//
// Run: node ../../tools/finalize-esm-output.js <esm-out-dir>

'use strict';

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const RUNTIME_EXT = '.mjs';
const DECL_EXT = '.d.mts';

const outDir = process.argv[2];
if (!outDir) {
  console.error('Usage: finalize-esm-output.js <esm-out-dir>');
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function isRelativeSpecifier(text) {
  return text.startsWith('./') || text.startsWith('../');
}

function rewriteSpecifiers(filePath, content, isDeclaration) {
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.ESNext,
    /* setParentNodes */ true,
    isDeclaration ? ts.ScriptKind.TS : ts.ScriptKind.JS
  );

  // Relative specifiers always point at the runtime extension, even
  // inside declaration files: TypeScript auto-pairs a companion .d.mts
  // for a .mjs specifier, but referencing .d.mts directly is treated as
  // importing the declaration file itself (TS2846).
  const ext = RUNTIME_EXT;
  const edits = [];

  const visit = (node) => {
    let specifier;
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifier = node.moduleSpecifier;
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      specifier = node.arguments[0];
    } else if (
      isDeclaration &&
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteral(node.argument.literal)
    ) {
      specifier = node.argument.literal;
    }

    if (
      specifier &&
      isRelativeSpecifier(specifier.text) &&
      !specifier.text.endsWith(ext)
    ) {
      edits.push({
        start: specifier.getStart(sourceFile),
        end: specifier.getEnd(),
        text: `'${specifier.text}${ext}'`,
      });
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  edits.sort((a, b) => b.start - a.start);

  let rewritten = content;
  for (const edit of edits) {
    rewritten =
      rewritten.slice(0, edit.start) + edit.text + rewritten.slice(edit.end);
  }
  return rewritten;
}

function retarget(filePath, fromExt, toExt) {
  return filePath.slice(0, -fromExt.length) + toExt;
}

function finalizeMapFile(
  mapPath,
  mapFromExt,
  mapToExt,
  fileFromExt,
  fileToExt
) {
  const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  if (typeof map.file === 'string' && map.file.endsWith(fileFromExt)) {
    map.file = retarget(map.file, fileFromExt, fileToExt);
  }
  const newPath = retarget(mapPath, mapFromExt, mapToExt);
  fs.writeFileSync(newPath, JSON.stringify(map));
  fs.unlinkSync(mapPath);
}

function finalizeSourceFile(filePath, fromExt, toExt, isDeclaration) {
  const original = fs.readFileSync(filePath, 'utf8');
  let content = rewriteSpecifiers(filePath, original, isDeclaration);

  const mapCommentExt = `${fromExt}.map`;
  const newMapCommentExt = `${toExt}.map`;
  content = content.replace(
    new RegExp(`(//# sourceMappingURL=.+)\\${mapCommentExt}$`, 'm'),
    (_, prefix) => `${prefix}${newMapCommentExt}`
  );

  const newPath = retarget(filePath, fromExt, toExt);
  fs.writeFileSync(newPath, content);
  fs.unlinkSync(filePath);
}

for (const filePath of walk(outDir)) {
  if (filePath.endsWith('.d.ts.map')) {
    finalizeMapFile(
      filePath,
      '.d.ts.map',
      `${DECL_EXT}.map`,
      '.d.ts',
      DECL_EXT
    );
  } else if (filePath.endsWith('.js.map')) {
    finalizeMapFile(
      filePath,
      '.js.map',
      `${RUNTIME_EXT}.map`,
      '.js',
      RUNTIME_EXT
    );
  } else if (filePath.endsWith('.d.ts')) {
    finalizeSourceFile(filePath, '.d.ts', DECL_EXT, /* isDeclaration */ true);
  } else if (filePath.endsWith('.js')) {
    finalizeSourceFile(filePath, '.js', RUNTIME_EXT, /* isDeclaration */ false);
  }
}

#!/usr/bin/env node
// Checks the generated API Markdown against the contract the OpenINF portal
// imports it under.
//
// The portal renders this corpus into its own documentation layout rather
// than serving TypeDoc's HTML, which makes the Markdown a product artifact
// with a consumer. That consumer is strict: it maps every generated path onto
// a public URL, strips the chrome TypeDoc puts above each page, and rewrites
// every internal link. Anything it cannot map, it refuses to import.
//
// Discovering that in the portal's build is too late -- by then the release is
// already published and the artifact already vendored. So the same rules run
// here, against the same files, before either happens:
//
//   paths   -- every page is the root README, the package index, or something
//              beneath `@openinf/<package>/`. TypeDoc emitting anywhere else
//              means a portal path with no URL to map it to.
//   chrome  -- the product link and breadcrumb TypeDoc writes above each page
//              match what the portal strips, and a heading survives it. The
//              portal takes each page's title from that heading.
//   links   -- every internal `.md` link resolves to a page that is actually
//              imported. Links inside code fences are examples, not
//              navigation, so they are left alone -- as the portal leaves
//              them alone.
//   nav     -- every path in navigation.json names an imported page. The
//              portal maps these to URLs and silently drops the ones it
//              cannot, which would publish an unnavigable sidebar entry.
//
// Run from the repo root: `pnpm run docs:check`.

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', 'docs', 'api');

// TypeDoc writes this above every page, from `name` in typedoc.json. The
// portal's chrome stripping matches on it literally, so renaming the project
// there without telling the portal would leave the product link in the body.
const PROJECT_NAME = 'OpenINF';

// TypeDoc's own navigation data, which the portal reads to build its package
// sidebar. It sits beside the Markdown rather than inside a page.
const NAVIGATION = 'navigation.json';

/**
 * Whether the portal imports a generated file as a page. Media that TypeDoc
 * copies alongside the Markdown is published as files, not documents.
 */
function isApiMarkdown(source) {
  return path.posix.extname(source) === '.md' && !source.startsWith('_media/');
}

/**
 * Maps a generated path onto the portal source path that publishes it, and
 * throws when TypeDoc has emitted somewhere the portal cannot place. This
 * mirrors `portalPath` in the portal's sdk-docs module.
 */
function portalPath(source) {
  if (source === 'README.md') return 'index.md';
  if (source === 'packages.md') return 'packages/index.md';

  const match = source.match(/^@openinf\/([^/]+)\/(.*)$/);
  if (match === null) throw new Error(`unexpected TypeDoc path: ${source}`);

  const [, name, remainder] = match;
  return remainder === 'README.md'
    ? `packages/${name}/index.md`
    : `packages/${name}/${remainder}`;
}

/**
 * Removes the product link and breadcrumb TypeDoc writes above every page,
 * exactly as the portal removes them, and returns what is left. The portal
 * reads the page title from the first heading of this remainder.
 */
function stripChrome(markdown) {
  return markdown
    .replace(/\r\n/g, '\n')
    .replace(
      new RegExp(
        `^(?:\\[\\*{1,2}${PROJECT_NAME}\\*{1,2}\\]\\([^\n)]*\\)` +
          `|\\*{1,2}${PROJECT_NAME}\\*{1,2})\n\n\\*\\*\\*\n\n`
      ),
      ''
    )
    .replace(
      new RegExp(`^\\[${PROJECT_NAME}\\]\\([^\n)]*\\)(?:\\s*/[^\n]*)?\n\n`),
      ''
    );
}

/**
 * Yields each link destination written as prose. Fenced and inline code hold
 * examples, where a link-shaped string is code rather than navigation, so
 * they are skipped the way the portal skips them.
 */
function* proseLinks(markdown) {
  const parts = markdown.split(/(```[\s\S]*?```|`[^`\n]*`)/);

  for (const [index, part] of parts.entries()) {
    if (index % 2 !== 0) continue;

    for (const match of part.matchAll(/\]\((<?[^()[\]\s<>]+>?)\)/g)) {
      const target = match[1];
      yield target.startsWith('<') && target.endsWith('>')
        ? target.slice(1, -1)
        : target;
    }
  }
}

/** Every path a navigation tree names, in the order it names them. */
function* navigationPaths(nodes, where) {
  if (!Array.isArray(nodes)) throw new Error(`${where} is not an array`);

  for (const node of nodes) {
    if (typeof node?.title !== 'string') {
      throw new Error(`${where} has an entry without a title`);
    }
    if (node.path !== undefined) yield node.path;
    if (node.children !== undefined) {
      yield* navigationPaths(node.children, where);
    }
  }
}

/** Every generated file beneath the Markdown root, as slash-separated paths. */
function generatedFiles(root) {
  return fs
    .readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) =>
      path
        .relative(root, path.join(entry.parentPath, entry.name))
        .replaceAll(path.sep, '/')
    )
    .sort();
}

const failures = [];

/** Records a problem against the page that has it. */
function fail(where, message) {
  failures.push(`${where}: ${message}`);
}

if (!fs.existsSync(ROOT)) {
  console.error('No API docs found. Run `pnpm run docs:build` first.');
  process.exit(1);
}

const files = generatedFiles(ROOT);
const pages = files.filter((file) => isApiMarkdown(file));
const importable = new Set(pages);

if (!importable.has('README.md')) {
  fail(ROOT, 'no README.md, so the API reference has no root page');
}

for (const page of pages) {
  const source = path.join(ROOT, page);
  const markdown = fs.readFileSync(source, 'utf8');

  try {
    portalPath(page);
  } catch (error) {
    fail(page, error.message);
  }

  const body = stripChrome(markdown);
  if (!/^# \S/.test(body) && !/^<h1[\s>]/.test(body)) {
    fail(page, 'has no heading once the portal strips TypeDoc chrome');
  }

  for (const target of proseLinks(markdown)) {
    const [file] = target.split('#');

    if (!file.endsWith('.md') || /^[a-z][a-z\d+.-]*:/i.test(file)) continue;
    if (file.startsWith('/')) {
      fail(page, `links to an absolute path the portal cannot map: ${file}`);
      continue;
    }

    const resolved = path.posix
      .normalize(path.posix.join(path.posix.dirname(page), file))
      .replace(/^\.\//, '');

    if (!importable.has(resolved)) {
      fail(page, `links to a page the portal does not import: ${file}`);
    }
  }
}

const navigation = path.join(ROOT, NAVIGATION);

if (!fs.existsSync(navigation)) {
  fail(NAVIGATION, 'was not written; the portal builds its sidebar from it');
} else {
  try {
    for (const target of navigationPaths(
      JSON.parse(fs.readFileSync(navigation, 'utf8')),
      NAVIGATION
    )) {
      if (!importable.has(target)) {
        fail(NAVIGATION, `names a page the portal does not import: ${target}`);
      }
    }
  } catch (error) {
    fail(NAVIGATION, error.message);
  }
}

if (failures.length > 0) {
  console.error(
    `The generated API documentation does not satisfy the portal's import ` +
      `contract:\n\n${failures.map((line) => `  ${line}`).join('\n')}\n`
  );
  process.exit(1);
}

console.info(
  `Validated ${pages.length} generated API Markdown pages against the ` +
    `portal's import contract.`
);

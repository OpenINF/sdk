---
'@openinf/assert': major
'@openinf/util-array': major
'@openinf/util-errors': major
'@openinf/util-md-table': major
'@openinf/util-object': major
'@openinf/util-text': major
'@openinf/util-types': major
'@openinf/gh-file-importer': major
---

**BREAKING:** the package now ships a `package.json` `exports` map that
restricts external resolution to the package root (`.`) and `./package.json`.
Deep/subpath imports that reached into build output directly (e.g.
`require('@openinf/util-text/dist/cjs/helpers/blueify')`) are no longer
resolvable — import from the package root instead
(`import { blueify } from '@openinf/util-text'`).

In exchange, the package now has a real, working ESM entrypoint:
`dist/esm/index.mjs` (with matching `.d.mts` declarations), selected
automatically via the `import` condition. Previously the `dist/esm` build
existed on disk but was unreachable and, independently, unloadable by Node (its
relative imports had no file extensions, which Node's ESM resolver requires).
Both are fixed. The package is also now marked `sideEffects: false`, so bundlers
can tree-shake unused exports.

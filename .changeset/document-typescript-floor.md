---
'@openinf/assert': patch
'@openinf/gh-file-importer': patch
'@openinf/util': patch
'@openinf/util-array': patch
'@openinf/util-core': patch
'@openinf/util-date': patch
'@openinf/util-errors': patch
'@openinf/util-md-table': patch
'@openinf/util-number': patch
'@openinf/util-object': patch
'@openinf/util-string': patch
'@openinf/util-text': patch
'@openinf/util-types': patch
---

Document TypeScript 6 as the compiler version the published declarations are
built and tested with, along with the `module` and `moduleResolution` pairs that
can read an `exports` map. `@openinf/util-date` needs it outright, for
`Temporal`. `AnyConstructor` now also accepts constructors with required
arguments, as its public contract promises.

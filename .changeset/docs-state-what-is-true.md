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

Made the READMEs and API reference say what is true. Each README names
TypeScript 6 as the release CI type-checks the published declarations with, and
the ones that need it say which `lib` entries or `@types/node` a consumer has to
supply for `Temporal`, `Float16Array` and `Buffer`, and that a CommonJS consumer
of `@openinf/gh-file-importer` cannot use `node16` resolution. The
`@openinf/util-errors` README says which codes Node.js also defines and where
their meanings differ, and its doc comments link only to codes Node.js has. The
`@openinf/util-types` README names every guard that checks shape rather than an
internal slot. The object helpers say they skip `__proto__`, `constructor` and
`prototype` and copy no symbol keys, `deepMerge` says when it shares a plain
object and when it throws on a cycle, `create` says it copies deeply, and `type`
lists the names it reports.

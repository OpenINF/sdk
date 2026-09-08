---
'@openinf/util': major
'@openinf/assert': patch
'@openinf/gh-file-importer': patch
'@openinf/util-array': patch
'@openinf/util-core': patch
'@openinf/util-errors': patch
'@openinf/util-md-table': patch
'@openinf/util-object': patch
'@openinf/util-text': patch
'@openinf/util-types': patch
---

Removed `maxSafeInteger` and `maxArrayIndex` from `@openinf/util`. They were a
hand-rolled copy of `Number.MAX_SAFE_INTEGER` and an alias of it, reachable
through the barrel but used by nothing. `isLength` now references the built-in
directly.

Internally, every module carried an `export default` alongside its named export
-- 195 of them. No barrel re-exported a default and no package declares subpath
exports, so none of it was reachable by a consumer. All 195 are gone and the
imports between modules are uniformly named, matching the public API.

Two dependencies that nothing imported were dropped: `@openinf/util-core` from
`@openinf/util-errors`, and `@openinf/util-text` from `@openinf/util`.

---
'@openinf/util-string': minor
'@openinf/util': major
'@openinf/util-text': major
'@openinf/util-types': patch
---

Added `@openinf/util-string`, the guards for ECMAScript strings and regular
expressions, following section 22 of the specification, Text Processing:
`isStringObject` and `isRegExp`, from `@openinf/util-types`, and `isEmail`,
`isEmptyString`, `isNonEmptyString`, `isStringContaining` and
`isStringNotContaining`, from `@openinf/util-text`. It depends only on
`@openinf/util-core`. `@openinf/util` re-exports all of it.

`@openinf/util-types` re-exports `isStringObject` and `isRegExp`, which Node's
`util.types` has, so its exports are unchanged.

**BREAKING:** `@openinf/util-text` no longer exports the string guards. None of
them was in a published version of it, which has always been the terminal text
helpers, and those are unchanged. Import the guards from `@openinf/util-string`
or `@openinf/util`.

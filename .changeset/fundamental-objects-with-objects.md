---
'@openinf/util-object': minor
'@openinf/util': patch
'@openinf/util-types': major
---

The guards for section 20 of the ECMAScript specification, Fundamental Objects,
move to `@openinf/util-object`: `isBooleanObject`, `isSymbolObject`,
`isNativeError`, `isArgumentsObject` (the arguments exotic object of section
10.4.4), `isMapLike` and `type`, from `@openinf/util-types`, and `isError`, from
`@openinf/util`.

`@openinf/util-types` re-exports the four that Node's `util.types` has,
`isBooleanObject`, `isSymbolObject`, `isNativeError` and `isArgumentsObject`,
and now depends on `@openinf/util-object`. `@openinf/util` re-exports `isError`.

**BREAKING:** `@openinf/util-types` no longer exports `isMapLike` or `type`.
Neither was in a published version of it. Import them from
`@openinf/util-object`.

---
'@openinf/util-core': minor
'@openinf/util': major
---

Widened `@openinf/util-core` to hold every elementary type predicate, not just
the six that happened to be imported across package boundaries. `isNumber`,
`isBoolean`, `isBigInt`, `isSymbol`, `isUndefined`, and `isNull` join
`isString`, `isFunction`, `isObject`, `isArray`, `isNullish`, and
`isNonNullish`.

The previous split was drawn by usage rather than by a rule: `isString` was in
core because `@openinf/util-text` imported it, while `isNumber` was not because
nothing happened to. That boundary would move every time a new call site
appeared. The rule is now stated in the package's README — core holds the shared
vocabulary types plus one predicate per elementary type test (a single `typeof`,
`Array.isArray`, or `null`/`undefined` comparison). Composites like
`isPrimitive` and refinements like `isInteger` stay in `@openinf/util`.

No change for consumers of `@openinf/util`, which re-exports all of them; both
names resolve to the same function object.

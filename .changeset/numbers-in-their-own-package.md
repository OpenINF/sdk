---
'@openinf/util-number': minor
'@openinf/util-core': minor
'@openinf/util': major
'@openinf/util-types': major
---

Added `@openinf/util-number`, the guards for ECMAScript numbers, following
sections 21.1 to 21.3 of the specification and the numeric conversions of
section 7.1: `isInteger`, `isFiniteNumber`, `isNaN`, `isInt32`, `isUint32`,
`isLength`, `isPositive`, `isNegative`, `isPositiveInteger`,
`isNegativeInteger`, `isNumberObject`, `isBigIntObject` and `maybeUnboxNumber`,
with the branded types they narrow to. It depends only on `@openinf/util-core`.

`@openinf/util` re-exports all of it, so importing any of these from
`@openinf/util` is unchanged. `@openinf/util-types` still exports
`isNumberObject` and `isBigIntObject`, which Node's `util.types` includes, as
re-exports.

`maybeUnboxNumber` moves too. It was never part of a published
`@openinf/util-types`, so nothing imports it from there; it is exported from
`@openinf/util-number` and `@openinf/util`.

The brand checks the guards for built-in objects are made from move from
`@openinf/util-types` to `@openinf/util-core`, so that every package can build
guards from them.

---
'@openinf/util': minor
'@openinf/util-types': major
---

The argument validators are all in `@openinf/util` now, where the coded errors
of `@openinf/util-errors` can be reached. `validateInteger` and `validateOneOf`
move there from `@openinf/util-types` and throw those errors rather than a plain
`TypeError` or `RangeError`: `InvalidArgTypeError` for a value of the wrong
type, `OutOfRangeError` for one outside a range, and `InvalidArgValueError` for
one that is not among the values allowed. Their messages now read like the rest,
with the argument name in curly quotes and the value that arrived.

**BREAKING:** `@openinf/util-types` no longer exports `validateCallback`,
`validateInteger`, `validateIntegerRange` or `validateOneOf`. None was in a
published version of it.

- `validateCallback` is `validateFunction` in `@openinf/util`, which asks the
  same question of any argument rather than one named `callback`.
- `validateIntegerRange` is `validateInteger`, which took the same arguments and
  differed only in the errors it threw and in defaulting to the 32-bit range
  rather than the safe integer range. Pass `min` and `max` for the old defaults.

`isIterator` moves the other way, from `@openinf/util` to `@openinf/util-types`,
which holds sections 24 to 28 of the specification; iteration is section 27.1.
`@openinf/util` re-exports it, so importing it from there is unchanged.

---
'@openinf/assert': patch
---

Kept assertion messages from throwing. `assertEqual` and the expectations of
`isEqualTo`, `isIdenticalTo`, `isGreaterThan`, `isGreaterThanOrEqualTo`,
`isLessThan` and `isLessThanOrEqualTo` described a value with `String`, which
throws a `TypeError` for an object without a prototype, so that `TypeError`
surfaced instead of the failed assertion. They now describe values the way
`assertValue` already did.

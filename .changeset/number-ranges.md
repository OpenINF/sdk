---
'@openinf/util-number': minor
---

Added `isSafeInteger`, `isNegativeZero`, and a guard for each of the remaining
fixed-width ranges the specification's conversions produce: `isInt8`, `isUint8`,
`isInt16` and `isUint16`, alongside the `isInt32` and `isUint32` already here.
Each narrows to a branded type.

`isSafeInteger` is the question `isInteger` cannot answer: beyond 2^53 - 1 a
double cannot hold every integer, so `2 ** 53` and `2 ** 53 + 1` are the same
number, and `isInteger` accepts both.

`isNegativeZero` is the question the operators cannot answer: `-0 === 0` is
`true`, while the specification keeps `-0𝔽` and `+0𝔽` apart throughout. It asks
`Object.is`, which performs SameValue.

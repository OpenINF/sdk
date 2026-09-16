---
'@openinf/util-array': minor
'@openinf/util-core': patch
'@openinf/util-types': minor
---

Added `isFloat16Array`, for the typed array ES2025 added. `@openinf/util-types`
exports it too, since Node's `util.types` has it and this package mirrors that,
and `isTypedArray` now narrows to a union that includes it.

The brand checks in `@openinf/util-core` gain `Float16Array`. Without it, a real
`Float16Array` failed the check, since no tag of its own distinguishes one: the
typed arrays are told apart by the `Symbol.toStringTag` getter they inherit.

Also fixed a stray bracket in the `@example` of all eleven existing typed array
guards, which read `isUint8Array([]]);`.

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

The guard remains available on runtimes without `Float16Array`, where it returns
`false` for the values those runtimes can construct. Creating a `Float16Array`
requires runtime support for the ES2025 constructor.

Also fixed a stray bracket in the `@example` of all eleven existing typed array
guards, which read `isUint8Array([]]);`.

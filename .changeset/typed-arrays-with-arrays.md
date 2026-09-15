---
'@openinf/util-array': minor
'@openinf/util-types': patch
---

The typed array guards move to `@openinf/util-array`, which follows section 23
of the ECMAScript specification, Indexed Collections: `isTypedArray`,
`isInt8Array`, `isUint8Array`, `isUint8ClampedArray`, `isInt16Array`,
`isUint16Array`, `isInt32Array`, `isUint32Array`, `isFloat32Array`,
`isFloat64Array`, `isBigInt64Array` and `isBigUint64Array`, with the
`TypedArray` type.

`@openinf/util-types` re-exports every one of them, since Node's `util.types`
has them, so its exports are unchanged. It now depends on `@openinf/util-array`.

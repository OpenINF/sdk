---
'@openinf/util': patch
---

`isInt32` and `isUint32` coerced their argument with `Number()` twice per call
and now do it once. Behavior is unchanged, verified against the previous
expressions across the Int32 and Uint32 boundaries, `-0`, `NaN`, the infinities,
hex strings, and the non-numeric cases.

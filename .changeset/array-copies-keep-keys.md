---
'@openinf/util-array': patch
---

`copyArray` defines each copied property rather than assigning it, so an
inherited setter or read-only index on a prototype can neither intercept nor
refuse the copy. `join` normalizes a fractional, negative or `NaN` length as
`Array.prototype.join` does, and `assocIndexOf` skips holes and other entries
that are not arrays instead of throwing. The README names `arrayIsHomogeneous`
correctly, and comments in `arrayIsHomogeneous`, `grep` and `map` no longer
claim that holes cannot reach the callback.

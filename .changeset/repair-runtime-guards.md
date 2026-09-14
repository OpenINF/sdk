---
'@openinf/util': major
'@openinf/util-object': major
---

Correct guards and validators that accepted values outside their documented
contracts. `isInt32` and `isUint32` no longer coerce strings, booleans, nullish
values, arrays, or bigints, and no longer throw for symbols.

`isArgValidBuffer` now accepts typed arrays and data views as documented.
`isAccessorDescriptor` and `isDataDescriptor`, which previously returned `true`
for every call without inspecting an argument, now validate and narrow actual
property descriptors.

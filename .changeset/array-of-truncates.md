---
'@openinf/util-array': patch
---

`arrayOf` no longer returns more elements than it was asked for. Given a
fractional count such as `2.5`, it allocated an array of two and then wrote a
third element past it. It now stops at the allocated length, which is the count
truncated.

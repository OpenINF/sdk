---
'@openinf/util-errors': patch
---

An error whose message spans several lines no longer repeats the end of its
message in `stack`, and a function with no usable name is described by its type
rather than as `function ""`.

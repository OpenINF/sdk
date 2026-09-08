---
'@openinf/util-errors': patch
---

Fixed `NodeTypeError`, `NodeRangeError`, `NodeSyntaxError`, and `NodeUriError`
(and, transitively, all 13 concrete exceptions built on them): each instance's
prototype was being rewired individually in the constructor via
`Object.setPrototypeOf(this, ...)`, which _replaced_ the instance's prototype
outright rather than extending it. This broke `toString()` (fell back to
`Object.prototype.toString`) and `instanceof` for both the built-in error type
(e.g. `instanceof TypeError`) and, in some cases, the leaf exception class
itself. The wiring now happens once, on each abstraction's `.prototype`, which
fixes both without disturbing the normal prototype chain.

---
'@openinf/util-types': major
---

Use native internal-brand checks for built-in object guards instead of trusting
`Object.prototype.toString`. Plain objects can set `Symbol.toStringTag`, so the
previous implementation let them impersonate dates, promises, errors, module
namespaces, typed arrays, boxed primitives, iterators, and other built-ins.

`isProxy` and `isExternal` now delegate to Node's supported implementations
instead of always returning `false`. `isStringObject` now narrows to the boxed
object type rather than the incompatible string primitive type.

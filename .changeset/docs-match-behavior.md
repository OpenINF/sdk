---
'@openinf/util-array': patch
'@openinf/util-core': patch
'@openinf/util-object': patch
'@openinf/util-types': patch
---

Made the API reference match what the functions do. `getAllKeys` is documented
as walking the whole prototype chain, which it always did. The `has` example no
longer claims an inherited key is missing, and `isNamed` says it rejects
functions. `create` accepts the prototype alone, as its documentation already
promised, and `getFunctionName` accepts a function that takes parameters and
finds the name of an async or generator function in its source. References to
functions that do not exist are gone, and `isTypedArray` lists `Float16Array`.

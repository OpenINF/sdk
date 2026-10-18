---
'@openinf/assert': patch
'@openinf/util': patch
'@openinf/util-array': patch
'@openinf/util-errors': patch
'@openinf/util-number': patch
'@openinf/util-object': patch
'@openinf/util-text': patch
'@openinf/util-types': patch
---

Corrected API reference entries that described something other than what the
code does. `isObjectCoercible` is documented as the object check it is,
`isNativeError` lists `Error` among the types it accepts, `map` says that it
drops `null` and `undefined` results, `curlyQuote` and `ellipsify` say what they
return without Unicode, and `inArray`, `merge`, `toArray`, `pushIfUnique` and
`getEntries` describe their parameters and results. The `isArgumentsObject`
example no longer reads `arguments` inside an arrow function, and
`createClassWrapper` has an example. `InvalidArgTypeError` links to its Node.js
error code.

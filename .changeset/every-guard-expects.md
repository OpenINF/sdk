---
'@openinf/util': patch
'@openinf/util-array': patch
'@openinf/util-object': patch
'@openinf/util-types': patch
---

Guards that had no `expectation` now have one, so a failed `assertValue` names
what was expected instead of saying "Expected value to be valid": `isArrayLike`,
`isDate`, `isMapLike`, `isStringObject`, `isTypedArray`, and the type-name
checks `isTypedArrayName`, `isObjectTypeName`, and `isPrimitiveTypeName`.

The API reference files the `@openinf/util-object` helpers under
`Fundamental Objects` alone, rather than splitting them across
`Fundamental Objects`, `Fundamental Object`, and `Object`, and lists `isMapLike`
under `Keyed Collections`.

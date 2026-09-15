---
'@openinf/util': patch
'@openinf/util-array': patch
'@openinf/util-core': patch
'@openinf/util-object': patch
'@openinf/util-text': patch
'@openinf/util-types': patch
---

Every export in these packages now has a category in the API reference, so none
of them is listed under "Other". Each category names a section of the ECMAScript
specification, and existing categories are corrected to match.

The guards for primitive values, `null` and `undefined`, such as `isString`,
`isNull` and `isNullish`, are filed under `Data Types and Values`, where the
language types are defined. They were split across four headings, including
`Value Properties`, which the specification reserves for the properties of the
global object. `isInt32`, `isUint32`, `isLength` and `isFalsy` are under
`Type Conversion`; `isFunction` and `isConstructor` under
`Testing and Comparison Operations`; `isMapLike` under `Fundamental Objects`;
and `isArrayBufferView` under `Structured Data`. `Index Collections` is now
`Indexed Collections`, and `isBuffer`, `isNode`, `isExternal` and
`isWebAssemblyCompiledModule` are under `Hosts and Implementations`.

Doc comments are added where declarations had none, including the type-name
lists and guards in `@openinf/util` and `@openinf/util-object`, and `omit`'s doc
comment, which sat above its import and so was never attached to it.

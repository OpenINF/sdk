---
'@openinf/util-core': patch
'@openinf/util-text': patch
'@openinf/util-types': patch
---

The packages now keep working when an application is minified with a tool that
renames properties, such as Closure Compiler in its ADVANCED mode.

`UnicodeEscapes` is a plain object again, as it was in 1.x, with a type of the
same name for its characters. As a TypeScript enum it compiled to quoted writes
read back unquoted, so once the reads were renamed, `curlyQuote` and
`ellipsify`, and every error message they quote a name in, printed `undefined`.

`isRawJSON`, `isNativeError` and the eight `isTemporal*` guards probe the host
for `JSON.isRawJSON`, `Error.isError`, Node.js's `process` and `Temporal`. Those
are now read by name, since a minifier with no declaration of them renames the
property, finds nothing, and the guard said `false` for every value or, in the
case of `isNativeError`, fell back to a check a forged prototype can fool.

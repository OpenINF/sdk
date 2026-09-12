---
'@openinf/gh-file-importer': patch
'@openinf/util-md-table': patch
'@openinf/util-types': patch
---

Corrected three README examples that could not have worked as written.

`@openinf/util-md-table` imported `mdTable2json` and then called `mdTbl2json`;
only the second exists. `@openinf/util-types` imported `isObject`, which it does
not export. `@openinf/gh-file-importer` documented a `log` object with four
methods where `Logger` requires six, and suggested passing `console`, which has
no `fatal` and so does not satisfy the type either; its logging section now
describes the real `logLevel` and `Logger` options.

---
'@openinf/assert': patch
'@openinf/util-array': patch
'@openinf/util-core': patch
'@openinf/util-date': patch
'@openinf/util-number': patch
'@openinf/util-object': patch
'@openinf/util-string': patch
'@openinf/util-types': patch
---

Every `@example` in the API reference now runs as written. Each one imports what
it uses, and the few that reached for something the reader would not have (a
browser `document`, an undeclared `input`, a module file that is not there) use
values of their own instead. The `isNamed` example is now a code block.

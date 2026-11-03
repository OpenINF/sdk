---
'@openinf/util-array': patch
'@openinf/util-md-table': patch
'@openinf/util-object': patch
---

Several helpers could be made to do far more work than their input called for.

`deepAssign`, `deepMixin` and `deepMerge` no longer merge a source object into a
target object again when nothing has changed since they last did. When the
source and the target both reached one object along several paths, it was merged
again along every one of them, so a graph a few dozen levels deep, or a few
levels wide within `deepMerge`'s default depth, never finished. A pair is still
merged again whenever anything has changed in between, so the last write wins as
before.

`copyArray`, and `deepAssign`, `deepMixin` and `create` when they copy an array,
read a long array through the indices it holds rather than every index below its
`length`, so copying `new Array(2 ** 32 - 1)` no longer takes minutes. Holes,
inherited indices and `length` are kept as before.

`mdTbl2json` reads only the cells a row has, rather than the whole header for
every row, so a wide header over many short rows no longer costs their product.

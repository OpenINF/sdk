---
'@openinf/util-object': patch
'@openinf/util-text': patch
---

`deepMerge` and the `mixin`/`deepMixin`/`deepAssign` family were quadratic in
the number of nested objects. Both tracked visited objects in an array and
consulted it with `includes`, once per node, and `deepMerge` additionally
drained its breadth-first queue with `shift()`, which reindexes the array on
every step. Merging an object with 32,000 nested objects took 196 ms;
`deepMixin` took 419 ms. They are now linear, at 11 ms and 13 ms — 17x and 33x —
and unchanged in behavior, including circular-reference detection and the
prototype-pollution guards.

`curlyQuote` ran environment detection twice per call, once for each quote
character. Roughly 2x faster as a result, which matters because it appears in
the error-message path of every package.

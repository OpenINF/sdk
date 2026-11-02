---
'@openinf/util-core': patch
---

The brand checks behind `isAsyncFunction`, `isAsyncGeneratorFunction` and
`isGeneratorFunction` read a block comment in a function's source as ending at
its first `*/`. The pattern they used could also run on through it into the next
comment, so a function with a few dozen adjacent comments before its name took
seconds to classify, and one with more never finished.

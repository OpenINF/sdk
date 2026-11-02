---
'@openinf/assert': patch
---

An assertion that fails on a value too big to describe in full now describes its
top level only. Messages repeat a shared object wherever it is reached, so a
small graph that reaches one object along many paths could take exponentially
more time and memory to describe than it holds, and the assertion never threw. A
value counts as too big once it would show more than 100,000 properties.

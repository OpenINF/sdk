---
'@openinf/util-text': patch
---

`stringify` describes a value that `String` cannot convert, such as an object
with a null prototype or a boxed Symbol, instead of throwing, and ends its
result at any line ending, not only a line feed. `curlyQuote` and `ellipsify` no
longer throw where there is no `process`.

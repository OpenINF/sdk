---
'@openinf/assert': patch
'@openinf/util-object': patch
'@openinf/util-types': patch
---

Made public predicates agree with the types they report. Relational checks no
longer coerce unrelated primitive types or pretend to narrow them, type-name
guards infer their result from the requested name, and `isIterator` recognizes
the iterator protocol without invoking `Symbol.iterator`.

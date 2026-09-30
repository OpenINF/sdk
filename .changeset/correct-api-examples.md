---
'@openinf/util-core': patch
'@openinf/util-number': patch
'@openinf/util-object': patch
'@openinf/util-types': patch
---

Correct API descriptions, examples, and guard expectations that contradicted the
runtime behavior. The documentation now distinguishes primitives from boxed
objects and accurately describes array-buffer views, object-like values, and
empty-object enumeration.

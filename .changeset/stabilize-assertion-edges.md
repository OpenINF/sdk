---
'@openinf/assert': major
---

Make assertion guards deterministic and faithful to their documented semantics.
Deep equality now uses SameValueZero for primitives, distinguishes array holes,
compares enumerable symbol properties, handles cycles, and rejects distinct
non-plain objects instead of treating them as equal because they have no
enumerable keys.

Relational assertions now fail when either operand is `NaN`. Regex guards reset
matching state between calls and do not mutate the caller's regular expression,
so global and sticky patterns return stable results.

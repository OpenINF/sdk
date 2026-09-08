---
'@openinf/util-object': patch
---

`getAllKeys` and `omit` were quadratic.

`getAllKeys` deduplicated with `pushIfUnique`, which scans the accumulated array
for every name it considers. On an object with 16,000 keys it took 1,349 ms; it
now tracks membership in a Set and takes 1.7 ms, with the same result —
first-occurrence order, walking the whole prototype chain, each name once.

`omit` tested `props.includes(key)` for every key of the source object, making
it O(keys x props). The list is now a Set built once. Omitting 16,000 properties
from a 16,000-key object went from 115 ms to 4 ms.

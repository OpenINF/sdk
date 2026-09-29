---
'@openinf/util-array': patch
'@openinf/util-object': patch
---

Preserved recursive graph structure while copying. `copyArray` now copies a
circular array, and an object it reaches by more than one path stays one object.
`deepAssign` and `deepMixin` no longer drop a sibling property pointing at the
same source object: where the target already holds an object at that path the
source is merged into it, and where the target holds nothing the alias or the
cycle is kept.

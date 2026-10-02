---
'@openinf/util-core': patch
'@openinf/util-array': patch
'@openinf/util-object': patch
---

Keep deep merges within the target's own properties, apply repeated source
arguments in order, and preserve cycles separately for existing destinations.
Copy plain objects from other realms consistently inside and outside arrays.

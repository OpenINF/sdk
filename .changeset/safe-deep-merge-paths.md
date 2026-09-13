---
'@openinf/util-object': major
---

**Security:** `deepMerge` no longer bypasses unsafe-key filtering once it passes
its depth limit. Beyond that depth it used `Object.assign`, which writes through
setters, so a payload such as `{"__proto__":{"isAdmin":true}}` replaced the
target's prototype at exactly the depth the filtering stopped.

`deepMerge` also accepts a source object that appears at more than one path.
Circular reference detection used a single set for the whole traversal, so a
node reached twice legitimately -- the same object under two keys -- was
reported as a cycle. Ancestry is tracked per path now, and real cycles still
throw.

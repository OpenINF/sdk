---
'@openinf/util-core': patch
---

`hasInterface` now validates a `constructor` property the interface declares. It
used to skip that key, so a guard for `{ constructor: number }` accepted `{}` on
the strength of its inherited `Object` constructor.

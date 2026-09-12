---
'@openinf/util': major
'@openinf/util-object': major
'@openinf/util-types': major
---

Make structural guards require every declared property before invoking its
validator, so a missing property no longer passes merely because its validator
accepts `undefined`. Symbol-keyed validators are now applied as well.

The `@openinf/util-types` lazy `hasInterface` form now resolves and applies the
returned validator map. Previously it passed the factory itself to
`hasProperties`, which has no enumerable keys, so every object passed.

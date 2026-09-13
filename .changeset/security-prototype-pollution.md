---
'@openinf/util-object': major
'@openinf/util-array': major
---

**Security:** fixed prototype pollution in every function that copies
caller-supplied keys onto a target.

`deepAssign` and `deepMixin` allowed an attacker-influenced object to mutate
`Object.prototype` for the entire realm:

```ts
deepAssign({}, JSON.parse('{"__proto__":{"isAdmin":true}}'));
({}).isAdmin; // → true, on every object in the process
```

`JSON.parse` produces `__proto__` as a genuine own property, so it survives
`hasOwn` and appears in `for...in` and `Object.keys`. The shared merge internal
then read `target[key]` to pick a recursion target, which for `__proto__`
resolved through the prototype chain to `Object.prototype` itself — making the
shared prototype the merge target rather than merely being assigned to.

`deepMerge`, `mixin`, `clone`, `omit`, and `@openinf/util-array`'s `copyArray`
had a contained variant of the same problem: they replaced the _result object's_
prototype instead of the global one.

All of them now silently skip `__proto__`, `constructor`, and `prototype`,
matching how hardened merge utilities in the ecosystem behave. Other properties
are copied as before, and ordinary deep merging is unaffected.

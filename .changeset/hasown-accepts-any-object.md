---
'@openinf/util-object': major
---

Fixed `hasOwn`, which could not be called with an object of unknown shape — the
case it exists for.

Its parameter was typed `Record<P, unknown>` with `P` inferred from the key, so
TypeScript required the object to already carry the very property being tested
for. `hasOwn({}, 'a')` was a compile error, and callers had to pass an explicit
type argument to work around it. Every in-workspace caller happened to pass a
`Record<string, unknown>` or an object already known to have the key, so it went
unnoticed until the packages were exercised from outside.

`obj` is now accepted as any `object`, matching `Object.hasOwn`. The return type
is also a type predicate now, so a successful check narrows the object and the
property can be read without a cast:

```ts
const value: object = JSON.parse(input);

if (hasOwn(value, 'id')) {
  value.id; // narrowed
}
```

`clone` is correspondingly constrained to `T extends object`; cloning a
primitive's own properties was never meaningful.

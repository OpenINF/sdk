---
'@openinf/util': minor
'@openinf/assert': minor
'@openinf/util-array': minor
---

Initial public release.

- **`@openinf/util`**: the base collection of type guards, validators, and
  assertions that the rest of the `@openinf` suite builds on (`isArray`,
  `isObject`, and friends — relocated here from `@openinf/util-types`, see the
  accompanying changeset on that package).
- **`@openinf/assert`**: runtime assertion and comparison guard utilities
  (`assertValue`, `isComparable`, `isEquatable`, and friends), split out as its
  own package.
- **`@openinf/util-array`**: `Array`-related utilities, including `toArray`
  (relocated here from `@openinf/util-types`).

All three ship with dual CJS/ESM entrypoints (`dist/cjs/index.js` and
`dist/esm/index.mjs`) from day one, selected via the package's `exports` map,
and are marked `sideEffects: false`.

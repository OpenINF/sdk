---
'@openinf/util-core': patch
'@openinf/util-object': patch
'@openinf/util-types': patch
---

`isNativeError` gives the same answer on every supported Node.js line. The
Node.js 22 line has no `Error.isError`, so it used to fall back to an error-like
check that accepted `Object.create(Error.prototype)` and a proxy around an
error, both of which Node.js 24 rejects. It now asks `node:util`'s
`types.isNativeError` there, which tests the same `[[ErrorData]]` slot.

On other engines without `Error.isError`, the fallback trusts the legacy error
tag, which only a real error reports, and uses local error ancestry only when a
custom `Symbol.toStringTag` hides that tag.

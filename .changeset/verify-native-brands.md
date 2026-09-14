---
'@openinf/util-types': major
---

Harden collection, buffer, typed-array, boxed-primitive, date,
regular-expression, and WebAssembly-module guards with captured standard
intrinsics, without a `node:util` dependency. These checks reject forged tags
and prototypes, accept cross-realm values, and do not modify inputs. Use
`Error.isError` when available, with an error-like fallback on older engines.

Strengthen the Underscore-derived fallback for opaque types with non-invoking
descriptor and shape checks, captured function-source classification, and module
namespace invariants. Casual tag spoofs are rejected, although carefully
constructed forgeries remain possible. Detect revoked proxies without invoking
their traps; live proxies and native external values remain undetectable.
`isStringObject` now narrows to a boxed object rather than the incompatible
string primitive type.

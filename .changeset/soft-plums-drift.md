---
'@openinf/util-text': minor
---

Removed the `cli-color`, `supports-ansi`, and `has-unicode` runtime dependencies
(the latter two unmaintained, and together pulling in 16 further transitive
packages via `cli-color`'s CommonJS-only dependency tree) in favor of small
internal ports. Output is byte-for-byte identical — verified by
differential-testing the ports against the original packages, including
`cli-color`'s asymmetric nesting behavior between colors and text formats — so
this is not expected to be observable. The package now has zero third-party
runtime dependencies and can be bundled as ESM without a `createRequire` shim.

---
'@openinf/util': major
'@openinf/assert': major
'@openinf/util-array': major
'@openinf/util-errors': major
'@openinf/util-md-table': major
'@openinf/util-object': major
'@openinf/util-text': major
'@openinf/util-types': major
'@openinf/gh-file-importer': major
---

**BREAKING:** `engines.node` raised from `>=12.0.0` to `>=20.19.0`.

The old value was never true. The source uses `node:`-prefixed imports (Node
14.18+) across 10 files and `??`/`?.` across 22, and compiles at
`target: esnext` with no downleveling, so none of these packages could run on
Node 12. Since `engines` is what npm checks to warn about an incompatible
runtime, it was suppressing exactly the warning it exists to give.

`>=20.19.0` is what `@openinf/gh-file-importer` already declared, and is the
minimum `@octokit/core` accepts. All nine packages now agree, and the value is
enforced by `tools/sync-package-metadata.js` so it cannot drift again.

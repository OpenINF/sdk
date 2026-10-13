---
'@openinf/assert': patch
'@openinf/util': patch
'@openinf/util-core': patch
'@openinf/util-date': patch
'@openinf/util-number': patch
'@openinf/util-object': patch
'@openinf/util-types': patch
---

Made the API reference examples run as written, and import from the package that
defines what they call. Twenty-four of them started with
`import util from '@openinf/util'`, but that package has no default export, so
the first line failed. Examples in `@openinf/util-core`, `util-number`,
`util-date`, `util-object` and `util-types` imported through `@openinf/util`'s
re-exports, which only works with `@openinf/util` installed; they now import
from their own package. The `isAsyncGenerator` example constructed something
that cannot be constructed, and the `isBigIntObject` example called it with no
argument. Links from one package's documentation to another's now show the name
they point to.

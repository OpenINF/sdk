---
'@openinf/util': patch
'@openinf/assert': patch
'@openinf/util-array': patch
'@openinf/util-text': patch
'@openinf/util-core': patch
'@openinf/util-errors': patch
'@openinf/util-md-table': patch
'@openinf/util-object': patch
'@openinf/util-types': patch
'@openinf/gh-file-importer': patch
---

Corrected package metadata and documentation that supply-chain scanners read as
quality signals.

`@openinf/util`'s README opened with a description of Java's `java.util` package
— collections framework, event model, date and time facilities, a string
tokenizer, a bit array — none of which this package contains. It also ended on
an empty section heading. It now describes what the package actually does, with
install and usage examples and a note on its relationship to
`@openinf/util-core`.

Every README linked to `../../docs/…` for its API reference, but `docs/` is
generated and gitignored, so those links resolved nowhere on npm or GitHub. They
now explain how to build the documentation instead of pointing at a path that
does not exist.

`@openinf/assert`, `@openinf/util`, `@openinf/util-array`, and
`@openinf/util-text` had no `keywords`.

A comment in `@openinf/util-text` explaining why its terminal detection _avoids_
spawning a subprocess named the child-process APIs directly, which a scanner
reading the shipped source could mistake for evidence of shell access. Reworded;
the package uses no such API.

---
'@openinf/util': minor
'@openinf/util-object': minor
'@openinf/util-types': minor
'@openinf/gh-file-importer': minor
---

Exported several types that already appeared in public signatures but were not
exported, so consumers had no way to name them: `ConformanceDescriptor`
(`@openinf/util`), `PropertyValidators` and `ExtractProperties`
(`@openinf/util-object`), `Tag` and `HasExpectation` (`@openinf/util-types`),
and `GetContentResponse` (`@openinf/gh-file-importer`).

`@openinf/util-types` now re-exports `Guard`, `Validator`, `HasExpectation`,
`Equatable`, `Comparable`, `ComparisonResult`, `Narrowable`, `Tag`, and `Tagged`
from `@openinf/util` instead of redefining them. The definitions were
byte-identical, so this is not a behavior or compatibility change; it just means
the two packages now share one definition and cannot drift apart.

Also removed a local `PropertyKey` declaration in `@openinf/util-object` that
duplicated TypeScript's own global of the same name, verbatim.

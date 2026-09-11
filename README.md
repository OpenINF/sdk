# OpenINF

Ten small TypeScript packages for the unglamorous parts of Node.js development:
type guards, argument validation, structured errors, and terminal text.

They are published separately, versioned together, and depend on almost nothing.

## Why another utility suite

Fair question. The honest answer is that these were extracted from working code
rather than designed as a product, and the thing that makes them worth
publishing is one idea, carried consistently:

**A type guard here is also the specification for its own check.**

Every guard carries an `expectation` describing what it tests. Assertion helpers
and argument validators read it to build their error messages, so the
description and the check cannot drift apart -- there is only one of them.

```ts
import { and, isInteger, isPositive } from '@openinf/util';

isInteger.expectation; // ↪ 'be an integer'

const isPositiveInteger = and(isInteger, isPositive);

isPositiveInteger(3); // ↪ true
isPositiveInteger(-3); // ↪ false

// Composition composes the specification too.
isPositiveInteger.expectation(); // ↪ 'be an integer and be a positive number'
```

Which is what makes the validators worth using: the message is derived, not
written by hand at each call site.

```ts
import { isArgValidString } from '@openinf/util';
import { InvalidArgTypeError } from '@openinf/util-errors';

isArgValidString(42, 'name');
// ↪ InvalidArgTypeError: The "name" argument must be of type "string".
//   Received type "number" ("42")
```

Errors are classes, not string codes, so callers can catch by type.

## Packages

| Package                                                  |                                                                          | Exports |
| -------------------------------------------------------- | ------------------------------------------------------------------------ | ------: |
| [`@openinf/util`](packages/util)                         | Guards, validators, and assertion helpers for every ECMAScript primitive |      56 |
| [`@openinf/util-types`](packages/util-types)             | Type-related predicates, including exotic and internal-slot detection    |      52 |
| [`@openinf/util-object`](packages/util-object)           | Object utilities -- merge, clone, mixin, omit                            |      42 |
| [`@openinf/assert`](packages/assert)                     | Runtime assertions and comparison guards                                 |      23 |
| [`@openinf/util-array`](packages/util-array)             | Array utilities                                                          |      16 |
| [`@openinf/util-text`](packages/util-text)               | Terminal-friendly text: quoting, color, ellipsis, Markdown               |      15 |
| [`@openinf/util-errors`](packages/util-errors)           | Error classes modeled on Node.js core error codes                        |      13 |
| [`@openinf/util-core`](packages/util-core)               | The shared vocabulary. No dependencies                                   |      12 |
| [`@openinf/gh-file-importer`](packages/gh-file-importer) | Fetches arbitrary files from remote GitHub repositories                  |       2 |
| [`@openinf/util-md-table`](packages/util-md-table)       | Markdown table generation                                                |       1 |

Install only what you need:

```shell
npm install @openinf/util
```

`@openinf/util` re-exports all of `@openinf/util-core`, so most consumers want
one of those two and nothing else.

## Design

**Nine of the ten have no third-party runtime dependencies.** The exception is
`gh-file-importer`, which needs `@octokit/rest` to talk to GitHub. Several
packages previously depended on small unmaintained modules; those were
reimplemented in TypeScript and verified against the originals by differential
testing before removal.

**The graph is layered.** `util-core` sits at the bottom with no dependencies at
all, holding the vocabulary everything else is written in -- `Guard`,
`Validator`, `Tagged`, and the elementary predicates. Depend on it alone if that
is all you need.

Redundant transitive edges omitted, so this is the shape of the graph rather
than the full list of every declared dependency:

```text
util-core
  └── util-array
        └── util-object
              ├── util-types
              └── util-text
                    └── assert
                          └── util-errors
                                ├── util
                                └── gh-file-importer

util-md-table   (independent of the rest)
```

**Dual CommonJS and ESM, with types for both.** Each package ships a CJS build
and an ESM build with `.mjs`/`.d.mts` extensions behind an `exports` map. A
package that resolves correctly from `import` but hands CJS consumers ESM-only
types is a common and near-invisible failure, so CI checks all four resolution
modes against the real packed tarball rather than trusting the config.

**`sideEffects: false` everywhere, and it is true.** Established by auditing
every top-level statement, not by assuming. Bundlers can drop what you do not
import.

**One version for all ten.** A breaking change in `util-core` can reach a
consumer through re-exports from a package that did not itself change;
independent versioning would report that as a patch bump and understate it.

## What CI enforces

Every change runs the build, [oxlint](https://oxc.rs) with type-aware rules, and
the full test suite, plus:

- [**publint**](https://publint.dev) and
  [**arethetypeswrong**](https://arethetypeswrong.github.io) against packed
  tarballs -- catches packaging faults the build and tests cannot see, because
  neither goes through the published `exports` map
- [**knip**](https://knip.dev) -- unused files, exports, and dependencies
- [**CodeQL**](https://codeql.github.com) and
  [**OpenSSF Scorecard**](https://scorecard.dev)

Releases are published from a manually triggered workflow using npm
[trusted publishing](https://docs.npmjs.com/trusted-publishers), with
[provenance](https://docs.npmjs.com/generating-provenance-statements)
attestations. No long-lived tokens exist in CI. Third-party actions are pinned
to commit SHAs.

## Requirements

Node.js `>=20.19.0`. TypeScript consumers want `moduleResolution` set to
`node16`, `nodenext`, or `bundler` -- the older `node` mode cannot read an
`exports` map.

## Documentation

API documentation is generated with [TypeDoc](https://typedoc.org):

```console
pnpm install
pnpm docs:build
pnpm docs:check
```

`docs:build` compiles the workspace before TypeDoc runs, which lets it resolve
the packages' internal dependencies exactly as a consumer does. The generated
Markdown and navigation data land in `docs/api/`; `pnpm docs:serve` opens that
output for local inspection.

The output is Markdown rather than TypeDoc's own HTML because it is read by
something else: the OpenINF portal renders it as the SDK's API reference, in the
portal's own layout. That makes these pages a product artifact with a consumer,
and `docs:check` holds them to what that consumer accepts: every page mappable
to a public URL, and every internal link resolving to a page that is actually
published.

`pnpm docs:artifact` packages the corpus for the portal, with a manifest naming
the release and the commit it came from. A release does this itself; see
[RELEASING.md](RELEASING.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for layout, conventions, and the checks
to run before opening a pull request. Maintainers releasing a version should
read [RELEASING.md](RELEASING.md).

Security issues go through [SECURITY.md](SECURITY.md), not the public issue
tracker.

## License

MIT. See [LICENSE](LICENSE).

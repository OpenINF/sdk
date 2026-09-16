# OpenINF

Thirteen small TypeScript packages for the unglamorous parts of Node.js
development: type guards, argument validation, structured errors, and terminal
text.

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
import { validateString } from '@openinf/util';
import { InvalidArgTypeError } from '@openinf/util-errors';

validateString(42, 'name');
// ↪ InvalidArgTypeError: The "name" argument must be of type "string".
//   Received type "number" ("42")
```

Errors are classes, not string codes, so callers can catch by type.

## Packages

| Package                                                  |                                                                                | Exports |
| -------------------------------------------------------- | ------------------------------------------------------------------------------ | ------: |
| [`@openinf/util`](packages/util)                         | Guards, validators, and assertion helpers for every ECMAScript primitive       |      70 |
| [`@openinf/util-object`](packages/util-object)           | Object utilities -- merge, clone, mixin, omit -- and Fundamental Object guards |      48 |
| [`@openinf/util-types`](packages/util-types)             | Type-related predicates, including exotic and internal-slot detection          |      46 |
| [`@openinf/util-array`](packages/util-array)             | Array utilities, and guards for typed arrays                                   |      29 |
| [`@openinf/assert`](packages/assert)                     | Runtime assertions and comparison guards                                       |      23 |
| [`@openinf/util-core`](packages/util-core)               | The language types and the guard vocabulary. No dependencies                   |      20 |
| [`@openinf/util-errors`](packages/util-errors)           | Error classes modeled on Node.js core error codes                              |      13 |
| [`@openinf/util-number`](packages/util-number)           | Integers, their sign and ranges, and Number and BigInt objects                 |      13 |
| [`@openinf/util-text`](packages/util-text)               | Terminal-friendly text: quoting, color, ellipsis, Markdown                     |      10 |
| [`@openinf/util-string`](packages/util-string)           | Strings and regular expressions: String objects, RegExps, string content       |       7 |
| [`@openinf/gh-file-importer`](packages/gh-file-importer) | Fetches arbitrary files from remote GitHub repositories                        |       2 |
| [`@openinf/util-date`](packages/util-date)               | `Date` objects and whether their time value is valid                           |       2 |
| [`@openinf/util-md-table`](packages/util-md-table)       | Markdown table generation                                                      |       1 |

Install only what you need:

```bash
npm install @openinf/util
```

`@openinf/util` re-exports all of `@openinf/util-core`, `@openinf/util-number`,
`@openinf/util-date` and `@openinf/util-string`, so most consumers want it and
nothing else.

## Design

**Twelve of the thirteen have no third-party runtime dependencies.** The
exception is `gh-file-importer`, which needs `@octokit/rest` to talk to GitHub.
Several packages previously depended on small unmaintained modules; those were
reimplemented in TypeScript and verified against the originals by differential
testing before removal.

**The graph is layered, and follows the specification.** `util-core` sits at the
bottom with no dependencies at all. It holds the language types and testing
operations of ECMAScript sections 6 and 7.2, and the vocabulary everything else
is written in -- `Guard`, `Validator` and `Tagged`. A package for a chapter of
the specification builds on it: `util-number` for Number, BigInt and Math, and
`util-date` for Date, `util-string` for String and RegExp. Depend on any of them
alone if that is all you need.

Each package builds only on the ones listed above it. A package names only the
dependencies it does not already reach through another, so `util-errors` names
`assert`, which brings `util-text` and the rest with it:

| Package            | Builds on                                                |
| ------------------ | -------------------------------------------------------- |
| `util-core`        | nothing                                                  |
| `util-md-table`    | nothing                                                  |
| `util-array`       | `util-core`                                              |
| `util-date`        | `util-core`                                              |
| `util-number`      | `util-core`                                              |
| `util-string`      | `util-core`                                              |
| `util-object`      | `util-array`                                             |
| `util-text`        | `util-object`                                            |
| `util-types`       | `util-date`, `util-number`, `util-object`, `util-string` |
| `assert`           | `util-text`                                              |
| `util-errors`      | `assert`                                                 |
| `gh-file-importer` | `util-errors`                                            |
| `util`             | `util-errors`, `util-types`                              |

**Dual CommonJS and ESM, with types for both.** Each package ships a CJS build
and an ESM build with `.mjs`/`.d.mts` extensions behind an `exports` map. A
package that resolves correctly from `import` but hands CJS consumers ESM-only
types is a common and near-invisible failure, so CI checks all four resolution
modes against the real packed tarball rather than trusting the config.

**`sideEffects: false` everywhere, and it is true.** Established by auditing
every top-level statement, not by assuming. Bundlers can drop what you do not
import.

**One version for all thirteen.** A breaking change in `util-core` can reach a
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

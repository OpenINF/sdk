# Contributing

Thanks for taking the time. This is a pnpm workspace containing twelve
`@openinf/*` packages that share a single version number.

## Getting set up

Node.js `>=24.15.0` and pnpm 11 are required. `.nvmrc` pins a version that meets
it, and a version manager that reads it will pick that up.

That is newer than the `>=20.19.0` the published packages declare, because the
two are for different people. Installing an `@openinf/*` package needs only what
the built code uses. Working on the repository also runs its tooling: the `.mts`
tasks and checkers are handed to Node as TypeScript, and the package tests mock
modules with the `exports` option of `mock.module`, which Node 24.15.0 is the
first 24.x release to accept.

```bash
pnpm install
pnpm run build
pnpm run test
```

`pnpm run build` compiles every package twice -- once to CommonJS and once to
ESM -- because all twelve ship dual entrypoints. If a build behaves oddly, run
it twice: the second run exercises the incremental cache, and a cache bug only
shows up then.

### Two TypeScript versions, deliberately

The packages build with TypeScript **7**. The root pins TypeScript **6**, and
that is not an oversight: TypeScript 7 dropped the JavaScript compiler API, and
both TypeDoc and `type-coverage` are built on it. TypeDoc's peer range stops at
`6.0.x`.

So `pnpm outdated` will report the root's `typescript` as behind for as long as
that holds, and Dependabot is configured to leave it alone. Revisit when TypeDoc
accepts 7.x.

## The layout

Packages live in [`packages/`](packages/) and depend on each other through
`workspace:*`. The dependency graph is layered, and the layering is load
bearing:

- `@openinf/util-core` sits at the bottom with **no dependencies**. It holds the
  shared vocabulary types (`Guard`, `Validator`, `Tagged`, and friends) and the
  elementary `typeof` predicates.
- Everything else builds on it. `@openinf/util` re-exports all of it, so
  consumers who want the whole toolkit need only one import.

Before adding something to `util-core`, read its README -- it documents the rule
for what belongs there. The short version: if it needs a dependency, it does not
go in `util-core`.

### The output is deliberately unbundled

One symbol per file is not only a style preference. Combined with
`sideEffects: false`, it is what lets a consumer's bundler discard whole files
without analyzing them, and it is worth a lot: importing a single function from
`@openinf/util` costs 109 bytes against 13.5 KB for the whole module.

Adding a bundler to the build looks appealing, because
`require('@openinf/util')` loads 182 modules and pre-bundling each package cuts
that to 7, taking about 25 ms down to 5.5 ms. Measured in August 2026, it is the
wrong trade: the same import then costs **954 bytes instead of 109**, roughly
nine times worse.

The reason is specific to this codebase. Every guard is followed by
`fn.expectation = '...'`, and once those functions share a module scope, a
bundler can no longer prove any individual assignment is dead, so all of them
survive. Per-file granularity is what makes the `expectation` design free.

Consumers who care about startup can bundle their own application and get the
109-byte result, which is better than anything publishing a bundle could give
them. Nothing in CI would catch this regression, so treat it as settled unless
you have new measurements.

## Making a change

Every package is a barrel. `src/index.ts` is the only thing consumers can reach,
because no package declares subpath exports. **If you add a module, export it
from the barrel** or it ships as dead weight.

Conventions worth knowing before your first PR:

- **Named exports only.** No `export default` anywhere, including internal
  modules. Imports between modules use the named form.
- **One symbol per file**, named in kebab-case after the symbol it exports.
- **Type guards carry an `expectation`.** A guard is not just a predicate; the
  assertion helpers and argument validators read `.expectation` to build their
  error messages, so a guard doubles as the specification for its own check.
- Internal-only modules live in `_internal/` and are prefixed with `_`.

## Before you open a PR

```bash
pnpm run build
pnpm run lint          # oxlint, type-aware
pnpm run test
pnpm run lint:format   # prettier, repo-wide
pnpm run lint:knip     # unused files, exports, and dependencies
pnpm run lint:commits  # commit message format and sign-off
pnpm run lint:examples # README examples compile and claim true results
pnpm run lint:md       # markdown, in files and in doc comments
pnpm run lint:types    # the build tasks and checkers type-check
pnpm run lint:spelling # cspell, en-US
pnpm run lint:packages # publint + arethetypeswrong, against real tarballs
```

`pnpm run format` fixes anything `lint:format` reports. It covers the whole
repository, not just TypeScript -- Markdown, JSON, and YAML included.

CI runs exactly these. Four of them are the ones people forget: `lint:knip`
catches an export you added but never wired into the barrel, `lint:commits`
catches a message the commit queue would refuse to land, `lint:packages` catches
a `package.json` change that breaks resolution for CommonJS or ESM consumers,
and `lint:spelling` covers prose along with the strings that ship -- error
messages and package descriptions reach users as surely as the code does.

**This project uses American English.** The dictionary is `en-US` rather than
plain `en` precisely because `en` accepts both spellings and lets them drift. If
the spell checker stops on a word that is genuinely correct, add it to the
`words` array in [`cspell.json`](cspell.json) -- sorted, in the group it belongs
to -- rather than disabling the check inline.

Coverage, if you want to see it:

```bash
pnpm run test:coverage
```

## Writing Markdown

Markdown is a product here rather than a convenience. Every package README goes
to npm, and every doc comment becomes a page in the API reference the portal
publishes. `pnpm run lint:md` holds both to the same rules, in three passes:

- **markdownlint** for structure -- heading order, empty links, list shape.
- **remark** for meaning -- the language on a fence, and whether a relative link
  or heading anchor resolves.
- **the doc comments**, which `tools/check-jsdoc-markdown.mts` lifts out of the
  TypeScript sources, strips the asterisk column from, and sends through those
  same remark rules. Two thirds of this repository's fenced blocks live there,
  where a Markdown linter would never look.

Prettier owns the shape of a file: wrapping at 80, indentation, blank lines,
which fence character. The rules that would argue with it are switched off, so
`pnpm run format` and `pnpm run lint:md` never disagree.

A fenced block has to name one of these:

```text
bash  console  diff  json  text  ts  yaml
```

The portal highlights a block by that flag and holds its own pages to the same
list, so one it does not know is one it cannot style. `ts` rather than
`typescript`, because the generated reference inherits `js` fences from
declarations this repository does not write, and the short forms read as a pair.

### In the editor

Open the repository in VS Code and take the recommended extensions. Both linters
then run over a Markdown file as you type, and Prettier formats it on save.
markdownlint fixes what it can, and remark reports the rest against
`.remarkrc.mjs` -- the file CI reads, so the squiggles are the failures.

The doc comments are the exception. Nothing reads those in the editor, because
the checker that lifts them out is a task rather than a language server, so
`pnpm run lint:md` is what catches a bad fence in an `@example`.

The dev container installs the extensions for you.

## Categorizing the API reference

TypeDoc lists a package's exports under the heading each one's `@category` tag
names. Once a package uses categories, anything without one is listed under
**Other**, which tells a reader nothing. So in those packages every export
carries a category, and the category is one of these, taken from the ECMAScript
specification:

| Category                            | ECMA-262                                               |
| :---------------------------------- | :----------------------------------------------------- |
| `Hosts and Implementations`         | 4.2 Hosts and Implementations                          |
| `Data Types and Values`             | 6 ECMAScript Data Types and Values                     |
| `Type Conversion`                   | 7.1 Type Conversion                                    |
| `Testing and Comparison Operations` | 7.2 Testing and Comparison Operations                  |
| `Exotic Objects`                    | 10.4 Built-in Exotic Object Internal Methods and Slots |
| `Fundamental Objects`               | 20 Fundamental Objects                                 |
| `Numbers and Dates`                 | 21 Numbers and Dates                                   |
| `Text Processing`                   | 22 Text Processing                                     |
| `Indexed Collections`               | 23 Indexed Collections                                 |
| `Keyed Collections`                 | 24 Keyed Collections                                   |
| `Structured Data`                   | 25 Structured Data                                     |
| `Managing Memory`                   | 26 Managing Memory                                     |
| `Control Abstraction Objects`       | 27 Control Abstraction Objects                         |
| `Reflection`                        | 28 Reflection                                          |

The section numbers are the current draft's, at <https://tc39.es/ecma262/>. File
an export under the section that defines what it tests or works with:

- **A language type** is `Data Types and Values`. That covers the guards and
  validators for a primitive (`isString`, `isNumber`, `validateBoolean`), for
  `null` and `undefined`, and for "any object" (`isObject`). The object
  counterparts belong to their own chapter: `isStringObject` is
  `Text Processing`, `isNumberObject` is `Numbers and Dates`.
- **A range the language converts into** is `Type Conversion`: `isInt32` and
  `isUint32` for ToInt32 and ToUint32, `isLength` for ToLength, `isFalsy` for
  ToBoolean.
- **An abstract test with no built-in method of its own** is
  `Testing and Comparison Operations`: `isFunction` for IsCallable,
  `isConstructor` for IsConstructor, `and`, `hasInterface`, and the `Guard` type
  itself. A test the language exposes as a method goes with that method's
  object, so `isArray` is `Indexed Collections`, where `Array.isArray` is.
- **Everything else** goes under the chapter of the object it concerns. A
  "map-like" is a plain object, so `isMapLike` is `Fundamental Objects` rather
  than `Keyed Collections`, which is `Map` and `Set`. An `ArrayBuffer` view is
  `Structured Data`, where `ArrayBuffer.isView` is defined.
- **What the host provides rather than the language**, such as Node's `Buffer`
  or WebAssembly, is `Hosts and Implementations`.

There is no `Value Properties` category. Section 19.1 is the four value
properties of the global object, `globalThis`, `Infinity`, `NaN` and
`undefined`, and nothing here is one. `null` in particular is a type, 6.1.2, not
a property of anything.

TypeDoc matches the tag as an exact string, so `Fundamental Object` would make a
second heading beside `Fundamental Objects`. `pnpm run lint:categories` refuses
a category that is not in this table, and an export left without one, and runs
as part of `pnpm run lint`.

## Changesets

Any change that affects a published package needs a changeset:

```bash
pnpm exec changeset
```

Pick the bump type, describe the change in a sentence or two aimed at someone
consuming the package, and commit the generated file in `.changeset/`. Adding
one does **not** publish anything -- releases are triggered manually by a
maintainer. See [RELEASING.md](RELEASING.md).

Changes that touch no published code -- CI config, docs, this file -- do not
need one.

## Commit messages

A pull request lands as one squashed commit whose subject is the pull request
**title**, so the title is what has to hold to the commit format:

```text
🏗️🔧：keep the checks off the generated pages
```

A category emoji, optionally an action emoji, then `：` -- the fullwidth colon,
U+FF1A, not the ASCII one -- then what the change does, in 50 characters or
fewer, with no full stop and no `#123` on the end. The vocabulary is listed in
[the pull request template](.github/PULL_REQUEST_TEMPLATE.md). Copy an emoji
from there rather than typing it: several have a lookalike spelling that is a
different string, and the checks read the string.

Body lines wrap at 72 columns. Trailers go in the last paragraph and nowhere
else, since that is the only place git reads them, in this order:

```text
Co-authored-by  Signed-off-by  Assisted-by  PR-URL  Fixes  Refs  Reviewed-by
```

Case is part of the spelling, and a space where a hyphen belongs -- `PR URL:` --
disqualifies every trailer beside it, so the whole block goes silently unread.
`Assisted-by` names a tool rather than a person, written `agent:model-version`,
as in `Assisted-by: Claude-Code:claude-opus-5`.

Every commit carries a `Signed-off-by:` naming its own author. That is the
Developer Certificate of Origin, reproduced in full in the pull request
template, and only the author can certify it -- an assistant discloses itself
with `Assisted-by:` and signs nothing. `git commit -s` writes the line for you.

`Co-authored-by:` is for people, and the check refuses one naming an assistant
or a bot account. Authorship is a claim only a person can make, and an agent
writing its own commit message reaches for that trailer by habit. It refuses on
the `[bot]` suffix, which GitHub reserves so that no person can hold it, on the
addresses the agents commit under, and on a handful of product names. Only the
last can reach a person. If it ever refuses a real co-author, narrow the pattern
in the same pull request rather than dropping the credit.

`pnpm run lint:commits` holds every commit on your branch to all of this, and
cross-checks its own reading of the trailers against `git interpret-trailers`,
so the rules cannot quietly drift from the tool they describe. Commits written
by Renovate and Dependabot are left alone: neither writes this format, neither
is ours to change, and holding them to it would leave every dependency update
failing its checks and never landing.

The pull request itself is read too, on every push. Its title answers to the
format above, because the title is the subject that lands. Its description only
has to exist -- the template is one long HTML comment, so a pull request opened
without a word written renders as nothing at all to a reader.

## Landing a pull request

Applying the **🚀 Status: Commit Queue** label lands it, once its checks have
passed. The queue builds the message from the branch's commits rather than from
the pull request body: every message is kept whole, each subject becoming a
heading, and the trailers are gathered into the one paragraph git reads, with
the pull request's own URL added. It then holds what it built to the rules above
and refuses to merge anything that does not pass them.

It also refuses a branch that conflicts, one targeting something other than
`main`, one with a check still running or failing, and a label applied by
someone who cannot push here -- applying a label needs only triage access, which
does not carry the right to push. The label comes back off whatever happens, so
re-applying it is always a deliberate second try, and a refusal says why in a
comment.

To read the message it would land, without landing anything:

```bash
pnpm land <number> --dry-run
```

That needs the [GitHub CLI](https://cli.github.com) authenticated, since it asks
the API for the branch's commits rather than fetching them.

## Reporting bugs and vulnerabilities

Ordinary bugs go in the issue tracker. For anything security related, follow
[SECURITY.md](SECURITY.md) instead of opening a public issue.

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

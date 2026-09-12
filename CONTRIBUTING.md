# Contributing

Thanks for taking the time. This is a pnpm workspace containing ten `@openinf/*`
packages that share a single version number.

## Getting set up

Node.js `>=20.19.0` and pnpm 11 are required.

```bash
pnpm install
pnpm run build
pnpm run test
```

`pnpm run build` compiles every package twice -- once to CommonJS and once to
ESM -- because all ten ship dual entrypoints. If a build behaves oddly, run it
twice: the second run exercises the incremental cache, and a cache bug only
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
pnpm run lint:fences   # every code fence names a language the portal knows
pnpm run lint:spelling # cspell, en-US
pnpm run lint:packages # publint + arethetypeswrong, against real tarballs
```

`pnpm run format` fixes anything `lint:format` reports. It covers the whole
repository, not just TypeScript -- Markdown, JSON, and YAML included.

CI runs exactly these. The last four are the ones people forget: `lint:knip`
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

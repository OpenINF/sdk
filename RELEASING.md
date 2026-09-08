# Releasing

Maintainer-facing notes for publishing the `@openinf/*` packages to npm.

## How versioning works here

All ten packages share **one version number**, always. This is Changesets'
[`fixed`](https://github.com/changesets/changesets/blob/main/docs/fixed-packages.md)
mode, configured in [`.changeset/config.json`](.changeset/config.json) as
`"fixed": [["@openinf/*"]]`.

Practically, that means:

- A release bumps **every** package, including ones with no changes. That is
  intentional: `@openinf/util-core` has eight transitive dependents here, and a
  breaking change in it can leak through re-exports to consumers of a package
  that didn't itself change. Independent versioning would signal that as a patch
  bump, which understates the risk.
- The whole group lands on the highest version any member needs. One `major`
  changeset anywhere makes it a major release for all ten.
- A package with no changeset naming it still gets bumped, but its generated
  `CHANGELOG.md` entry will be a bare heading with no body. When a release
  genuinely doesn't touch a package, write it a one-line changeset saying so
  rather than shipping an empty entry.

## Day-to-day: recording a change

Changesets are **not** derived from commit messages. They are markdown files you
write, so squashing or rewriting history doesn't affect them.

After making a change that should appear in a release:

```sh
pnpm changeset
```

Answer the prompts (which packages, what bump type, summary), and commit the
generated `.changeset/*.md` file alongside your work. The summary becomes the
changelog entry, so write it for a consumer, not for yourself.

Not every change needs one. Refactors, test-only changes, and CI tweaks
generally don't.

Don't hand-edit any `packages/*/CHANGELOG.md`. Changesets owns those files and
inserts each new version directly beneath the `# @openinf/<name>` title, so
hand-written entries drift downward and end up interleaved with generated ones.
`CHANGELOG.md` is listed in each package's `files`, so it ships to consumers.

To see what a release would currently produce, without changing anything:

```sh
pnpm changeset status --verbose
```

## Cutting a release

The release workflow is **manual only** — it has no push trigger, so merging to
`main` never starts a release. Cutting one is two deliberate runs of the
**Release** workflow from the Actions tab:

1. Merge work with changesets into `main`. Only CI runs.
2. Run **Release**. With changesets pending, it opens a **"Version packages"**
   PR: `changeset version` consumes the changeset files, bumps every
   `package.json`, and writes the `CHANGELOG.md`s. Nothing is published.
3. Review that PR — it is the last checkpoint before anything is public. Check
   the version numbers and that each changelog entry reads sensibly.
4. Merge it. Still nothing is published.
5. Run **Release** again. With no changesets left, it publishes the versions
   that are not yet on the registry.

Re-run step 2 whenever new changesets land on `main` and you want the PR
refreshed; it is not updated automatically.

To do it by hand instead:

```sh
pnpm run version-packages   # changeset version + lockfile refresh
# review the diff, then:
pnpm run build
pnpm run release            # pnpm -r publish --no-git-checks
```

Always `pnpm -r publish`, never `changeset publish` or `npm publish`: internal
dependencies use the `workspace:*` protocol, and only pnpm rewrites that into a
real version range when packing. Publishing with npm would ship a literal
`"workspace:*"` dependency that no consumer can install.

## First-time setup: trusted publishing

Publishing uses npm
[trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) rather
than a long-lived `NPM_TOKEN`. Short-lived, workflow-scoped credentials can't
leak from logs or need rotating.

The `release` script also passes `--provenance`, so each package ships a signed
[provenance attestation](https://docs.npmjs.com/generating-provenance-statements)
linking the tarball to the commit and workflow run that produced it. npm shows a
verified badge for it on the package page.

Three things to know about that flag.

It is undocumented in `pnpm publish --help` but genuinely supported -- pnpm
rejects flags it does not recognize, so it would fail loudly rather than
silently skip.

**Provenance requires a public repository.** From a private one the publish
fails outright rather than degrading to an unsigned publish.

**Provenance requires the `repository` URL to match the repository you publish
from.** Both the owner and the repository name have to agree -- a matching org
alone is not enough. Every package declares the value of `REPO_URL` in
[`tools/sync-package-metadata.js`](tools/sync-package-metadata.js), which is the
single place it is defined. Before the first release, confirm that URL is the
repository the release workflow will run in; if it is not, change it there and
re-run `pnpm run sync-metadata` so all ten packages stay in step.

Verify it actually landed, rather than assuming:

```sh
npm view @openinf/util --json | grep -A3 attestations
```

Two constraints make the first release different from every later one:

- **Trusted publishing is configured per package**, not per org. Ten packages
  means ten setups on npmjs.com.
- **A package must already exist on npm before you can configure it.** There's
  no way to pre-authorize a name that has never been published.

`@openinf/util-core`, `@openinf/util`, `@openinf/assert`, and
`@openinf/util-array` have never been published. So, once:

1. Publish those four manually, authenticated locally with an npm account that
   can create packages under the `@openinf` scope:

   ```sh
   pnpm run build
   pnpm --filter @openinf/util-core --filter @openinf/util \
        --filter @openinf/assert --filter @openinf/util-array publish
   ```

   `publishConfig.access` is set to `public` in each `package.json`, so no
   `--access` flag is needed — without it npm would reject a scoped package as
   private.

2. For **each** of the ten packages, on npmjs.com → package → Settings → add a
   trusted publisher:
   - Organization/user: the GitHub owner of this repo
   - Repository: this repo
   - Workflow filename: `release.yml` — just the filename, **not** the full
     `.github/workflows/release.yml` path, which is a common cause of an E404
     that looks like a missing package rather than an auth failure

3. Confirm no `NPM_TOKEN` secret remains configured for the repo. If one exists,
   it may take precedence over OIDC and defeat the point.

After that, both steps run from the Actions tab and no npm credentials live in
CI.

## Before you publish

`prepublishOnly` runs the build for each package, so a broken build can't be
published. Beyond that:

```sh
pnpm run build && pnpm run lint && pnpm run test
```

To inspect exactly what a consumer will receive, without publishing:

```sh
pnpm --filter @openinf/util-text pack
tar -tzf openinf-util-text-*.tgz
```

Worth checking that `dist/` and `src/` are both present, that no `.tsbuildinfo`
crept in, and that `workspace:*` dependencies were rewritten to real versions
inside the packed `package.json`.

`src/` ships deliberately: the generated sourcemaps reference it
(`"sources": ["../../src/index.ts"]`), so without it every published map dangles
and a consumer's debugger can't show the original TypeScript. Nothing resolves
to `src/` at runtime — `main`, `types`, and `exports` all point into `dist/`.

## Notes and gotchas

- **`pnpm-lock.yaml` must be committed** with version bumps. `version-packages`
  runs `pnpm install --lockfile-only` for this reason; CI uses
  `--frozen-lockfile` and will fail if the lockfile is stale.
- **Internal deps publish as exact pins.** `workspace:*` becomes the
  dependency's exact version (`"@openinf/util": "3.0.0"`), not a range. That's
  consistent with `fixed` versioning, but it does mean a consumer installing two
  `@openinf` packages from different releases gets two copies of the shared
  dependency. Switching the specifiers to `workspace:^` would publish caret
  ranges and let consumers dedupe.
- **Prerelease mode** (`changeset pre enter next`) exists for shipping a
  `3.1.0-next.0` line, but it's easy to get wrong — do it on a dedicated branch,
  never on `main`, or it blocks every other merge until you exit.
- **pnpm's version is pinned** to 11.7.0 in both workflows. If you bump it, bump
  it in both, and note that pnpm had an OIDC publishing regression in the 11.0.x
  line — verify a publish still works after upgrading.

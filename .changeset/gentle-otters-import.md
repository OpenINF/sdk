---
'@openinf/gh-file-importer': major
---

**BREAKING:** redesigned `GhFileImporter`'s public API:

- Methods that took positional `(owner, repo, path, ref)` arguments now take a
  single `RepoLocation` object instead.
- Renamed for clarity: `fetchMetadata` → `fetchContent`, `fetchFileContents` →
  `fetchFileText`, `fetchFileContentsFromUrl` → `fetchUrlText`, `importContents`
  → `importFile`, `importContentsFromUrl` → `importUrl`.
- `importFile`/`importUrl` now return the path the file was written to, instead
  of the file's contents. They also create parent directories as needed before
  writing.
- `octokit` and `options` are no longer exposed as public instance properties;
  only `log` remains public.
- `fetchFileText` now narrows its result with a real `isContentFile` type guard
  (also newly exported) and throws a clear error instead of silently
  mis-decoding when `path` resolves to a directory, symlink, or submodule.
- `options.auth` is a new, explicit override for the existing `GITHUB_TOKEN`
  environment-variable fallback.

`RepoLocation`, `GetContentData`, `ContentFile`, and `isContentFile` are newly
exported for consumers who want to type their own calls precisely.

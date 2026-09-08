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

Pointed `repository` and `bugs` at the repository this code actually lives in.

Every package declared `https://github.com/openinf/openinf` for both, which is
not where any of it is. npm renders those two fields as the "Repository" and
"Report issues" links on a package page, and the tooling that ties a published
tarball back to its source reads `repository.url`, so both sent readers
somewhere they could not follow.

They now name `https://github.com/OpenINF/sdk`, as does
`tools/sync-package-metadata.js`, which is what writes them into each
`package.json`.

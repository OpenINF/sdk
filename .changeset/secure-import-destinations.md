---
'@openinf/gh-file-importer': major
---

**Security:** prevent imports from following filesystem symlinks outside
`destDir`, including a symlink used as the final destination file.

URL downloads now reject non-success HTTP responses instead of writing their
error bodies, and the default filename is derived from the URL pathname so query
strings and fragments do not become part of the local filename.

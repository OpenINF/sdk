---
'@openinf/gh-file-importer': patch
---

`importFile` and `importUrl` no longer truncate a file before checking where it
is. Every check of the destination was of a path, so a directory swapped for a
symbolic link after the last check still redirected the write, and the file it
led to was emptied and overwritten. The file is now opened without truncating
it, and on Linux the file actually opened is checked against `destDir` before
any of it changes. Elsewhere, `destDir` needs to be a directory that nobody less
trusted than the caller can change while an import runs, as the README now says.

The URL in the download log line and in the error for a failed download has its
control characters percent-encoded, so a URL holding a line break or a terminal
escape can no longer forge a log line or restyle the terminal.

---
'@openinf/gh-file-importer': patch
---

`importFile` and `importUrl` write the bytes they receive unchanged, so binary
files, files in encodings other than UTF-8, and a leading byte-order mark all
arrive intact. Both previously decoded the body as UTF-8 text first, and
`importUrl` also dropped a byte-order mark. A `destPath` that resolves to
`destDir` itself is now refused with an error saying so, rather than one blaming
a symbolic link or the URL.

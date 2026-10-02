---
'@openinf/gh-file-importer': patch
---

Fetch repository files larger than 1 MB through GitHub's raw contents API when
the metadata response omits their contents. Keep the configured authentication
and requested ref, preserve UTF-8 text, and propagate download failures.

---
'@openinf/util-core': patch
---

Hardened the GitHub Actions workflows with explicit least-privilege permissions.
CI declares `contents: read`, and the release workflow denies everything at the
workflow level and re-grants only the three scopes its job needs. Neither
previously declared permissions at all, so both inherited whatever the
repository default happened to be.

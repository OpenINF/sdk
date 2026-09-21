---
'@openinf/assert': major
'@openinf/gh-file-importer': major
'@openinf/util': major
'@openinf/util-array': major
'@openinf/util-core': major
'@openinf/util-date': major
'@openinf/util-errors': major
'@openinf/util-number': major
'@openinf/util-md-table': major
'@openinf/util-object': major
'@openinf/util-string': major
'@openinf/util-text': major
'@openinf/util-types': major
---

**BREAKING:** `engines.node` is now `>=22.11.0`, up from `>=20.19.0`.

OpenINF supports the Node.js release lines still inside an LTS window, and drops
a line once it reaches end of life rather than carrying it as best-effort. Iron
(20.x) reached end of life on 2026-04-30, so the old floor had been admitting an
unsupported line. 22.11.0 is where Jod entered LTS, which makes it the first
22.x a consumer can be on and still be supported.

Nothing in the code changed, and nothing that worked on Node 22 or later behaves
differently. What changed is the promise: installing on Node 20 now warns rather
than passing silently, and the floor moves again on 2027-04-30, when Jod reaches
end of life.

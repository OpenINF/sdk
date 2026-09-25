---
'@openinf/assert': patch
'@openinf/gh-file-importer': patch
'@openinf/util': patch
'@openinf/util-array': patch
'@openinf/util-core': patch
'@openinf/util-errors': patch
'@openinf/util-number': patch
'@openinf/util-object': patch
'@openinf/util-string': patch
'@openinf/util-text': patch
'@openinf/util-types': patch
---

Each package's `LICENSE` now carries the copyright notice and license of every
project it copies code from: TypeShield, TypeScript, Node.js, Deno, jQuery,
Lodash, Dojo, `is`, and the three small packages ported in place of
dependencies. Their licenses require the notice in every copy, and no package
reproduced it. Source comments that credited a project no code was taken from
are removed, and files copied from TypeScript or TypeShield without saying so
now say so. A commented-out snippet from Stack Overflow, licensed CC BY-SA, is
removed from `@openinf/util-types`. No behavior change.

---
'@openinf/util-core': patch
---

`pnpm run test` loads every package's ESM build and compares what it exports
with what its CommonJS build exports. Until now only one of the two builds ever
ran: the tests compile the TypeScript sources for CommonJS, and `lint:packages`
checks that `dist/esm` resolves for each kind of consumer without loading it. A
build that threw on import, or that lost an export on its way through the ESM
step, would have passed both and reached npm.

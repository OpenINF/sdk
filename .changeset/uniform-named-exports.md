---
'@openinf/util-md-table': major
'@openinf/gh-file-importer': major
---

**BREAKING:** removed the package-level default export. `@openinf/util-md-table`
and `@openinf/gh-file-importer` were the only two of the ten packages that had
one, and in both cases it duplicated an export already available by name.

Import by name instead:

```diff
- import mdTbl2json from '@openinf/util-md-table';
+ import { mdTbl2json } from '@openinf/util-md-table';

- import GhFileImporter from '@openinf/gh-file-importer';
+ import { GhFileImporter } from '@openinf/gh-file-importer';
```

Every package now exposes named exports only, so there is one import style
across the suite. Named-only also keeps the CJS and ESM surfaces identical — a
default export shows up as a `default` key on the CJS namespace object but as a
real default binding in ESM, which is the sort of asymmetry that makes interop
confusing.

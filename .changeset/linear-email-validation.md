---
'@openinf/util-string': major
---

Keep `isEmail` validation linear for long invalid addresses while preserving the
existing basic syntax check. The guard now narrows accepted strings to the
exported `Email` type, so rejecting an address no longer incorrectly excludes
all strings from the caller's type.

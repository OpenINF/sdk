---
'@openinf/util': patch
'@openinf/util-object': patch
---

Fixed two checks that reported the wrong answer. `validateArgCount` named
`maxCount` when it was `argCount` that was not an integer. `objectsEqualShallow`
counted `{ a: undefined }` and `{}` as equal, because it compared values only;
it now compares the keys too.

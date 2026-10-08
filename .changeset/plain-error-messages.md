---
'@openinf/util-errors': patch
---

Error messages that list three or more expected types no longer wrap the last
one in a second pair of quotes. `InvalidArgTypeError` for
`['string', 'number', 'boolean']` used to end its list with `or '“boolean”'`.

`InvalidArgTypeError` also no longer puts terminal escape codes in its message.
It italicized "must" whenever stdout was a terminal, so the same error read
differently in a log file, in a test, and on screen.

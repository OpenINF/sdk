---
'@openinf/util-errors': patch
---

Fixed error messages that corrupted the value they were reporting.

`getInspectedMaybeCapped` stripped the first and last character of every
inspected value, which is only correct for a quoted string. Numbers, booleans,
and bigints were mangled — `42` was reported as `''` and `true` as `'ru'`. The
same unconditional slice in the object branch emptied `{}` and `[]` entirely,
chopped a character off each end of a `Date` or `RegExp`, and turned an `Error`
into a mangled multi-line stack trace embedded in the message.

Quotes are now stripped only from strings, the `[Object]`/`[Array]` depth
placeholders are unwrapped only when they are actually that placeholder, and a
value that inspects across multiple lines is cut to its first line.

`InvalidArgTypeError` also named the expected type twice, since it interpolated
it inline and then appended a sub-message that renders it again, producing
`The "x" argument must be string.of type "string"`. It now defers to the
sub-message, matching its sibling `InvalidReturnTypeError`.

Four exceptions put a space before a clause that already began with
`". Received"`, giving `is invalid . Received`.

Before and after, for `new InvalidArgTypeError('x', 'string', 1)`:

```diff
- The "x" argument must be string.of type "string". Received type "number" ("")
+ The "x" argument must be of type "string". Received type "number" ("1")
```

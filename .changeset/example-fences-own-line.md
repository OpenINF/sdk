---
'@openinf/assert': patch
'@openinf/util': patch
'@openinf/util-array': patch
'@openinf/util-core': patch
'@openinf/util-object': patch
'@openinf/util-text': patch
'@openinf/util-types': patch
---

Fixed the code examples in 82 JSDoc comments, which opened their fenced block on
the `@example` line itself. TypeDoc reads the rest of such a tag as text rather
than as a block, so it wrapped each example in a second fence and left the
comment's leading asterisk in the first line of code. Every affected example
rendered as unusable output in the generated API reference and in the
declaration files that ship to editors.

The fences now open on the line after the tag. No signature, behavior, or
documented meaning changed -- only whether the example is readable.

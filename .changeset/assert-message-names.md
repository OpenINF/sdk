---
'@openinf/assert': patch
---

`assertEqual` and `assertLessThan` no longer end their messages with a stray
period and space when no message is given, and `assertEqual` keeps its second
message when the first is omitted. The `Assert` decorator now names a private
auto-accessor `Counter#value` rather than `Counter##value`.

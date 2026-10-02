---
'@openinf/util-text': patch
---

Respect escaped opening backticks in `mdCodeSpans2html`, including odd and even
runs of preceding backslashes. Closing delimiters still treat backslashes as
code text, and scanning remains linear for long inputs.

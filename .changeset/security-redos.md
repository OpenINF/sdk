---
'@openinf/util-text': major
---

**Security:** fixed quadratic backtracking (ReDoS) in `mdCodeSpans2html`.

The code-span pattern combined a lazy quantifier with a backreference, so
runtime grew with the square of the input: 80 KB of adversarial backticks took
about 20 seconds, and a 1 MB input would have run far longer. Any caller passing
untrusted Markdown through it could be stalled by a single call.

It is now a single left-to-right scan, linear in input length. The same 80 KB
input takes about 2 ms, and 1 MB takes about 10 ms.

One behavior change falls out of this. The opening and closing backtick runs
must now be equal _maximal_ runs, which is what CommonMark specifies. The old
pattern could begin matching in the middle of a run, so `` ```a` `` was treated
as a code span; it no longer is. Well-formed Markdown is unaffected — this was
verified by differential-testing the new implementation against the old one over
20,000 randomized backtick-dense inputs, where every difference was of this
kind.

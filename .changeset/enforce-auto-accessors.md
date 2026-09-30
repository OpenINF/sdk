---
'@openinf/assert': major
---

**BREAKING:** `Assert` is now a standard auto-accessor decorator. Compile with
standard decorators and a `target` of `es2022` or lower, and write
`@Assert(...) accessor value` so validation can cover both the initializer and
every later assignment; legacy property decorators are shadowed by modern
class-field semantics and cannot enforce that contract.

The initializer is validated too, so an accessor left without one is validated
as `undefined`. Give it an initializer the validator accepts, or let the
validator accept `undefined`; a constructor that assigns the accessor runs too
late to stand in for an initializer.

Assertion failures now also describe circular, BigInt-containing, and hostile
values without leaking an incidental serialization error.

---
'@openinf/gh-file-importer': minor
---

Fixed logging, which was only half-wired: the built-in logger was hardcoded to
the `info` level with no way to lower it, so two `debug`-level diagnostics
(explaining that an omitted `path`/`ref` falls back to the repo root/default
branch) could never be emitted; and neither the built-in logger nor a
caller-supplied one was ever passed to the underlying Octokit client, so
Octokit's own request-lifecycle logging never reached it.

Both are now fixed:

- New `options.logLevel`
  (`'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'`, default `'info'`)
  configures the built-in logger. `options.log`, if supplied, still takes
  precedence and disables `logLevel`.
- Whichever logger is in effect — built-in or caller-supplied — is now also
  passed to the Octokit client, so its request-lifecycle logs flow through the
  same place as this package's own messages.

**Behavior change:** if you previously supplied `options.log`, it will now also
receive Octokit's request-lifecycle log calls, which it did not before.

The `Logger` and `LogLevelName` types are now exported — previously
`log`/`options.log` were typed with `Logger`, but the type itself was
unreachable, so consumers had no way to name it.

The dependency on `console-log-level` (unmaintained, and its `require('util')`
prevented this package from being bundled as ESM) has been replaced with an
internal, behavior-identical port.

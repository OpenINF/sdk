---
'@openinf/gh-file-importer': major
---

**Security:** `importFile` and `importUrl` no longer write outside `destDir`.

Both resolved the destination with `path.resolve(destDir, destPath)`, which is
not a containment check: a `..` segment walks out of the directory, and an
absolute path discards `destDir` entirely. The JSDoc described `destPath` as
"relative to `destDir`", but nothing enforced it — so an application forwarding
a user-chosen filename had an arbitrary file write.

```js
await importer.importUrl(url, '../../../../etc/cron.d/evil'); // wrote there
```

The resolved path is now compared against `destDir` and an
`InvalidArgValueError` is thrown if it escapes. The check compares against
`destDir + path.sep`, so a sibling directory sharing the prefix
(`/tmp/safe-evil` against `/tmp/safe`) is rejected too. Paths that stay inside,
including nested ones, behave exactly as before.

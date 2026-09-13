# @openinf/gh-file-importer

Fetches arbitrary files from remote GitHub repositories and writes them into a
local directory.

## Installation

```bash
npm install @openinf/gh-file-importer
```

## Usage

Every option is optional except `destDir`, which is where fetched files are
written.

```ts
import { GhFileImporter } from '@openinf/gh-file-importer';

const ghFileImporter = new GhFileImporter({ destDir: './tmp' });

await ghFileImporter.importFile({
  owner: 'tc39',
  repo: 'proposals',
  path: 'README.md',
});
```

To avoid exceeding the GitHub API rate limit, set a `GITHUB_TOKEN` environment
variable containing a
[personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).

## Logging

The built-in logger writes to the console. `logLevel` sets the lowest level it
emits, one of `trace`, `debug`, `info`, `warn`, `error`, or `fatal`, and
defaults to `info`.

```ts
import { GhFileImporter } from '@openinf/gh-file-importer';

const ghFileImporter = new GhFileImporter({
  destDir: './tmp',
  logLevel: 'debug',
});
```

To send logging somewhere else, pass a `log` implementing all six levels. It
replaces the built-in logger, so `logLevel` no longer applies, and Octokit's own
request logging flows through it too.

```ts
import { GhFileImporter, type Logger } from '@openinf/gh-file-importer';

const log: Logger = {
  trace: () => {},
  debug: () => {},
  info: () => {},
  warn: console.warn,
  error: console.error,
  fatal: console.error,
};

const ghFileImporter = new GhFileImporter({ destDir: './tmp', log });
```

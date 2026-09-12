// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { constants as fsConstants } from 'node:fs';
import { mkdir, open, realpath } from 'node:fs/promises';
import {
  basename as pathBasename,
  dirname as pathDirname,
  resolve as pathResolve,
  sep as pathSep,
} from 'node:path';

import { Octokit } from '@octokit/rest';
import {
  InvalidArgTypeError,
  InvalidArgValueError,
  InvalidPropertyValueError,
  MissingOptionError,
} from '@openinf/util-errors';
import { hasOwn } from '@openinf/util-object';
import { blueify, curlyQuote, ellipsify, underline } from '@openinf/util-text';

import {
  createLogger,
  isLogLevelName,
  type Logger,
  type LogLevelName,
} from './_internal/console-log-level';

export type { LogLevelName, Logger } from './_internal/console-log-level';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface GhFileImporterOptions {
  /** Directory that imported files are written into. */
  destDir: string;
  /**
   * A GitHub personal access token. Falls back to `process.env.GITHUB_TOKEN`
   * when omitted, so unauthenticated callers still get the usual rate-limit
   * benefit without doing anything -- pass an empty string to force
   * unauthenticated requests instead.
   */
  auth?: string;
  /**
   * Minimum level the built-in logger emits. Defaults to `'info'`. Ignored
   * when {@link GhFileImporterOptions.log} is supplied, since that replaces
   * the built-in logger outright.
   */
  logLevel?: LogLevelName;
  /**
   * Logger used by this instance and handed to Octokit, so its request
   * lifecycle logging flows through it too. Takes precedence over
   * {@link GhFileImporterOptions.logLevel}.
   */
  log?: Logger;
}

/** Identifies a location within a GitHub repository. */
export interface RepoLocation {
  owner: string;
  repo: string;
  path?: string;
  ref?: string;
}

type GetContentParams = NonNullable<
  Parameters<Octokit['repos']['getContent']>[0]
>;
/** The full response from GitHub's contents API, including status and headers. */
export type GetContentResponse = Awaited<
  ReturnType<Octokit['repos']['getContent']>
>;

/**
 * Whatever GitHub's contents API returns: a file, symlink, submodule, or
 * (when the requested path is a directory) an array of directory entries.
 */
export type GetContentData = GetContentResponse['data'];
export type ContentFile = Extract<GetContentData, { type: 'file' }>;

/**
 * Narrows a {@link GetContentData} value to a single file entry.
 * @param data The value returned by {@link GhFileImporter.fetchContent}.
 * @returns `true` when `data` describes a single file (not a directory
 *  listing, symlink, or submodule).
 */
export function isContentFile(data: GetContentData): data is ContentFile {
  return !Array.isArray(data) && data.type === 'file';
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function validateOwner(owner: string): void {
  if (typeof owner !== 'string') {
    throw new InvalidArgTypeError('owner', 'string', owner);
  } else if (owner === '') {
    throw new InvalidArgValueError(
      'owner',
      owner,
      'is invalid because an empty string was provided'
    );
  }
}

function validateRepo(repo: string): void {
  if (typeof repo !== 'string') {
    throw new InvalidArgTypeError('repo', 'string', repo);
  } else if (repo === '') {
    throw new InvalidArgValueError(
      'repo',
      repo,
      'is invalid because an empty string was provided'
    );
  }
}

function validateRequiredPath(path: string): void {
  if (typeof path !== 'string') {
    throw new InvalidArgTypeError('path', 'string', path);
  } else if (path === '') {
    throw new InvalidArgValueError(
      'path',
      path,
      'is invalid because an empty string was provided'
    );
  }
}

function validateOptionalPath(path: string | undefined, log: Logger): void {
  if (path === undefined) {
    log.debug(
      `The ${curlyQuote('path')} argument was missing and has been ` +
        `omitted causing Octokit to use the repo root directory`
    );
  } else if (typeof path !== 'string') {
    throw new InvalidArgTypeError('path', 'string', path);
  } else if (path === '') {
    throw new InvalidArgValueError(
      'path',
      path,
      'is invalid because an empty string was provided'
    );
  }
}

function validateRef(ref: string | undefined, log: Logger): void {
  if (ref === undefined) {
    log.debug(
      `The ${curlyQuote('ref')} argument was missing and has been ` +
        `omitted causing Octokit to use the repo default branch ` +
        `(often ${curlyQuote('main')})`
    );
  } else if (typeof ref !== 'string') {
    throw new InvalidArgTypeError('ref', 'string', ref);
  } else if (ref === '') {
    throw new InvalidArgValueError(
      'ref',
      ref,
      'is invalid because an empty string was provided'
    );
  }
}

/**
 * Resolves `relativePath` against `destDir` and refuses to leave it.
 *
 * `path.resolve` is not a containment check: a `..` segment walks out of
 * `destDir`, and an absolute path discards it entirely. Both would let a
 * caller-supplied filename become an arbitrary file write, so the resolved
 * path is compared against `destDir` before it is returned.
 * @param destDir The directory writes are confined to.
 * @param relativePath The caller-supplied path to resolve within it.
 * @returns The resolved absolute path, guaranteed to be inside `destDir`.
 * @throws {InvalidArgValueError} if the path escapes `destDir`.
 */
function resolveWithinDestDir(destDir: string, relativePath: string): string {
  const root = pathResolve(destDir);
  const resolved = pathResolve(root, relativePath);

  // The separator check keeps `/tmp/safe-evil` from passing as `/tmp/safe`.
  if (resolved !== root && !resolved.startsWith(root + pathSep)) {
    throw new InvalidArgValueError(
      'destPath',
      relativePath,
      `is invalid because it resolves outside ${curlyQuote(root)}`
    );
  }

  return resolved;
}

function isWithinDirectory(root: string, candidate: string): boolean {
  return candidate === root || candidate.startsWith(root + pathSep);
}

/**
 * Writes a file only after checking the physical parent directory. The lexical
 * check in {@link resolveWithinDestDir} rejects `..` and absolute paths; this
 * second check rejects paths whose existing symlink components leave
 * `destDir`. `O_NOFOLLOW` applies the same rule to the final path component.
 * @param destDir The directory writes are confined to.
 * @param relativePath The caller-supplied path to resolve within it.
 * @param text The contents to write.
 * @returns The absolute path of the written file.
 */
async function writeWithinDestDir(
  destDir: string,
  relativePath: string,
  text: string
): Promise<string> {
  const filepath = resolveWithinDestDir(destDir, relativePath);
  const root = pathResolve(destDir);
  const parent = pathDirname(filepath);

  await mkdir(parent, { recursive: true });

  const [physicalRoot, physicalParent] = await Promise.all([
    realpath(root),
    realpath(parent),
  ]);
  if (!isWithinDirectory(physicalRoot, physicalParent)) {
    throw new InvalidArgValueError(
      'destPath',
      relativePath,
      `is invalid because a symbolic link resolves outside ${curlyQuote(
        physicalRoot
      )}`
    );
  }

  const handle = await open(
    filepath,
    fsConstants.O_CREAT |
      fsConstants.O_TRUNC |
      fsConstants.O_WRONLY |
      fsConstants.O_NOFOLLOW,
    0o666
  );
  try {
    await handle.writeFile(text);
  } finally {
    await handle.close();
  }

  return filepath;
}

function validateUrl(url: string): void {
  if (typeof url !== 'string') {
    throw new InvalidArgTypeError('url', 'string', url);
  } else if (url.length === 0) {
    throw new InvalidArgValueError(
      'url',
      url,
      'is invalid because an empty string was provided'
    );
  }
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

export class GhFileImporter {
  readonly #octokit: Octokit;
  readonly #destDir: string;
  public readonly log: Logger;

  /**
   * Creates an instance of GhFileImporter.
   * @param options The options object.
   * @throws {InvalidArgTypeError} if `options.destDir` is not a string.
   * @throws {InvalidPropertyValueError} if `options.destDir` is an empty
   *  string.
   * @throws {MissingOptionError} if `options.destDir` is omitted.
   */
  public constructor(options: GhFileImporterOptions) {
    if (!hasOwn(options, 'destDir')) {
      throw new MissingOptionError('destDir');
    } else if (typeof options.destDir !== 'string') {
      throw new InvalidArgTypeError(
        'options.destDir',
        'string',
        options.destDir
      );
    } else if (options.destDir.length === 0) {
      throw new InvalidPropertyValueError(
        'options',
        'destDir',
        options.destDir,
        'is invalid because an empty string was provided'
      );
    }

    if (options.logLevel !== undefined && !isLogLevelName(options.logLevel)) {
      throw new InvalidPropertyValueError(
        'options',
        'logLevel',
        options.logLevel,
        'is invalid because it does not name a log level'
      );
    }

    this.#destDir = options.destDir;
    this.log =
      options.log ?? createLogger({ level: options.logLevel ?? 'info' });

    // Octokit's logger interface (debug/info/warn/error) is a subset of
    // Logger, so handing it ours routes its request lifecycle logging
    // through the same place as this package's own messages.
    const auth = options.auth ?? process.env['GITHUB_TOKEN'];
    this.#octokit = auth
      ? new Octokit({ auth, log: this.log })
      : new Octokit({ log: this.log });
  }

  /**
   * Retrieves the raw contents API response for a repo location: a file,
   * symlink, submodule, or (when `path` names a directory) an array of
   * directory entries.
   * @see https://docs.github.com/en/rest/reference/repos#get-repository-content
   * @param location The repo location to fetch.
   * @returns The file, symlink, submodule, or directory-listing data GitHub
   *  returns for `location`.
   * @throws {InvalidArgTypeError} if `owner`, `repo`, `path`, or `ref` on
   *  `location` is not a string.
   * @throws {InvalidArgValueError} if `owner`, `repo`, `path`, or `ref` on
   *  `location` is an empty string.
   */
  public async fetchContent(location: RepoLocation): Promise<GetContentData> {
    validateOwner(location.owner);
    validateRepo(location.repo);
    validateOptionalPath(location.path, this.log);
    validateRef(location.ref, this.log);

    const params: Partial<GetContentParams> = {
      owner: location.owner,
      repo: location.repo,
    };
    if (location.path !== undefined) params.path = location.path;
    if (location.ref !== undefined) params.ref = location.ref;

    // Octokit's types require `path`, but the REST API treats an omitted
    // path as the repo root -- the behavior this method deliberately allows.
    const res = await this.#octokit.repos.getContent(
      params as GetContentParams
    );
    return res.data;
  }

  /**
   * Retrieves and decodes a single file's contents as text.
   * @param location The repo location to fetch; `path` is required.
   * @returns The decoded file contents.
   * @throws {InvalidArgTypeError} if `owner`, `repo`, `path`, or `ref` on
   *  `location` is not a string.
   * @throws {InvalidArgValueError} if `owner`, `repo`, `path`, or `ref` on
   *  `location` is an empty string.
   * @throws {Error} if `path` resolves to a directory, symlink, or submodule
   *  instead of a file.
   */
  public async fetchFileText(
    location: RepoLocation & { path: string }
  ): Promise<string> {
    validateRequiredPath(location.path);
    const data = await this.fetchContent(location);
    if (!isContentFile(data)) {
      throw new Error(`${curlyQuote(location.path)} did not resolve to a file`);
    }
    return Buffer.from(data.content, data.encoding as BufferEncoding).toString(
      'utf-8'
    );
  }

  /**
   * Fetches the text contents of an arbitrary URL (not necessarily hosted on
   * GitHub, and not authenticated).
   * @param url The URL to fetch.
   * @returns The fetched body text.
   * @throws {InvalidArgTypeError} if `url` is not a string.
   * @throws {InvalidArgValueError} if `url` is an empty string.
   * @throws {Error} if the server returns a non-success HTTP status.
   */
  public async fetchUrlText(url: string): Promise<string> {
    validateUrl(url);

    this.log.info(
      `${ellipsify(`Download of ${blueify(underline(url))} has started`)}`
    );

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Download of ${curlyQuote(url)} failed with HTTP ${response.status}` +
          (response.statusText === '' ? '' : ` ${response.statusText}`)
      );
    }
    return response.text();
  }

  /**
   * Fetches a single repo file and writes it under `destDir`, preserving
   * `path`'s directory structure (creating parent directories as needed)
   * unless `destPath` overrides where it's written.
   * @param location The repo location to fetch; `path` is required.
   * @param destPath An optional path (relative to `destDir`) to write to
   *  instead of `location.path`.
   * @returns The absolute path the file was written to.
   * @throws {InvalidArgTypeError} if `owner`, `repo`, `path`, or `ref` on
   *  `location` is not a string.
   * @throws {InvalidArgValueError} if `owner`, `repo`, `path`, or `ref` on
   *  `location` is an empty string.
   * @throws {Error} if `location.path` resolves to a directory, symlink, or
   *  submodule instead of a file.
   */
  public async importFile(
    location: RepoLocation & { path: string },
    destPath?: string
  ): Promise<string> {
    const text = await this.fetchFileText(location);
    return writeWithinDestDir(this.#destDir, destPath ?? location.path, text);
  }

  /**
   * Fetches an arbitrary URL and writes it under `destDir`.
   * @param url The URL to fetch.
   * @param destPath An optional path (relative to `destDir`) to write to
   *  instead of the URL's basename.
   * @returns The absolute path the file was written to.
   * @throws {InvalidArgTypeError} if `url` is not a string.
   * @throws {InvalidArgValueError} if `url` is an empty string.
   */
  public async importUrl(url: string, destPath?: string): Promise<string> {
    validateUrl(url);
    const relativePath = destPath ?? pathBasename(new URL(url).pathname);
    if (relativePath === '') {
      throw new InvalidArgValueError(
        'url',
        url,
        'is invalid because its pathname does not contain a filename'
      );
    }

    const text = await this.fetchUrlText(url);
    return writeWithinDestDir(this.#destDir, relativePath, text);
  }
}

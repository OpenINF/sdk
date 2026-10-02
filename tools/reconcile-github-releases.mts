/**
 * @file Restore GitHub releases that a partially failed release run omitted.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} tools/reconcile-github-releases
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

interface ReleaseSpec {
  body: string;
  name: string;
  prerelease: boolean;
  tag: string;
}

type Request = (requestPath: string, init?: RequestInit) => Promise<Response>;

/** Extract one version's body from a Changesets changelog. */
export function changelogEntry(changelog: string, version: string): string {
  const heading = `## ${version}`;
  const allLines = changelog.split('\n');
  const start = allLines.findIndex((line) => line.trimEnd() === heading);
  if (start === -1) throw new Error(`Missing changelog entry for ${version}`);

  const lines = allLines.slice(start + 1);
  const end = lines.findIndex((line) => line.startsWith('## '));
  return lines
    .slice(0, end === -1 ? undefined : end)
    .join('\n')
    .trim();
}

async function responseError(response: Response, operation: string) {
  const detail = await response.text();
  return new Error(
    `${operation} failed with ${response.status}${detail ? `: ${detail}` : ''}`
  );
}

/** Ensure a tagged package version has its corresponding GitHub release. */
export async function reconcileRelease(
  release: ReleaseSpec,
  request: Request
): Promise<'created' | 'exists'> {
  const encodedTag = encodeURIComponent(release.tag);
  const tag = await request(`/git/ref/tags/${encodedTag}`);
  if (!tag.ok) throw await responseError(tag, `Reading tag ${release.tag}`);

  const existing = await request(`/releases/tags/${encodedTag}`);
  if (existing.ok) return 'exists';
  if (existing.status !== 404) {
    throw await responseError(existing, `Reading release ${release.tag}`);
  }

  const created = await request('/releases', {
    method: 'POST',
    body: JSON.stringify({
      tag_name: release.tag,
      name: release.name,
      body: release.body,
      prerelease: release.prerelease,
    }),
  });
  if (!created.ok) {
    throw await responseError(created, `Creating release ${release.tag}`);
  }
  return 'created';
}

async function main(): Promise<void> {
  const repository = process.env['GITHUB_REPOSITORY'];
  const token = process.env['GITHUB_TOKEN'];
  if (!repository || !token) {
    throw new Error('GITHUB_REPOSITORY and GITHUB_TOKEN are required');
  }

  const request: Request = async (requestPath, init) =>
    fetch(`https://api.github.com/repos/${repository}${requestPath}`, {
      ...init,
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        'x-github-api-version': '2022-11-28',
      },
    });

  const entries = await readdir(path.join(ROOT, 'packages'), {
    withFileTypes: true,
  });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const directory = path.join(ROOT, 'packages', entry.name);
    const manifest = JSON.parse(
      await readFile(path.join(directory, 'package.json'), 'utf8')
    ) as { name?: string; private?: boolean; version?: string };
    if (!manifest.name || !manifest.version || manifest.private) continue;
    const changelog = await readFile(
      path.join(directory, 'CHANGELOG.md'),
      'utf8'
    );
    const tag = `${manifest.name}@${manifest.version}`;
    const result = await reconcileRelease(
      {
        tag,
        name: tag,
        body: changelogEntry(changelog, manifest.version),
        prerelease: manifest.version.includes('-'),
      },
      request
    );
    process.stdout.write(`${result}: ${tag}\n`);
  }
}

if (
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}

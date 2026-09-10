import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function normalizeGitUrl(url) {
  // git@github.com:org/repo.git -> https://github.com/org/repo
  const sshMatch = url.match(/^git@([^:]+):(.+?)(\.git)?$/);
  if (sshMatch) {
    return `https://${sshMatch[1]}/${sshMatch[2]}`;
  }
  return url.replace(/\.git$/, '');
}

/**
 * Reads `.gitmodules` at `repoRoot` and, for each submodule, resolves its
 * origin URL and the exact commit it's checked out at, so cross-repo links
 * inside imported submodule content can be rewritten to live GitHub blob URLs.
 */
export function getSubmoduleLinkBases(repoRoot) {
  const gitmodulesPath = path.join(repoRoot, '.gitmodules');
  if (!fs.existsSync(gitmodulesPath)) {
    // No submodules is valid, not an error.
    return [];
  }

  const output = execFileSync('git', ['submodule', 'foreach', '--quiet', 'echo $sm_path'], {
    cwd: repoRoot,
  }).toString();
  const relPaths = output.split('\n').filter(Boolean);

  return relPaths.map((relPath) => {
    const submoduleRoot = path.join(repoRoot, relPath);
    const remoteUrl = execFileSync('git', ['-C', submoduleRoot, 'remote', 'get-url', 'origin'])
      .toString()
      .trim();
    // Pin to exact commit — submodule HEAD is detached, not a branch.
    const commit = execFileSync('git', ['-C', submoduleRoot, 'rev-parse', 'HEAD']).toString().trim();

    return {
      submoduleRoot,
      repoBlobBase: `${normalizeGitUrl(remoteUrl)}/blob/${commit}`,
    };
  });
}

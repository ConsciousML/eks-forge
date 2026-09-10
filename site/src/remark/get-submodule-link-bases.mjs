import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function normalizeGitUrl(url) {
  // git@github.com:org/repo.git -> https://github.com/org/repo
  const sshMatch = url.match(/^git@([^:]+):(.+?)(\.git)?$/);
  if (sshMatch) {
    return `https://${sshMatch[1]}/${sshMatch[2]}`;
  }
  // Strip trailing slash so it doesn't double up before /blob/<sha>.
  return url.replace(/\.git$/, '').replace(/\/$/, '');
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

  let output;
  try {
    output = execFileSync('git', ['submodule', 'foreach', '--quiet', 'echo $sm_path'], {
      cwd: repoRoot,
    }).toString();
  } catch (err) {
    throw new Error(`Failed to list git submodules in ${repoRoot}: ${err.message}`);
  }
  const relPaths = output.split('\n').filter(Boolean);

  return relPaths.map((relPath) => {
    const submoduleRoot = path.join(repoRoot, relPath);

    let remoteUrl;
    let commit;
    try {
      remoteUrl = execFileSync('git', ['-C', submoduleRoot, 'remote', 'get-url', 'origin']).toString().trim();
      // Pin to exact commit — submodule HEAD is detached, not a branch.
      commit = execFileSync('git', ['-C', submoduleRoot, 'rev-parse', 'HEAD']).toString().trim();
    } catch (err) {
      throw new Error(
        `Failed to resolve submodule "${relPath}" at ${submoduleRoot} — ` +
          `is it initialized? Run "git submodule update --init --recursive". (${err.message})`
      );
    }

    return {
      submoduleRoot,
      repoBlobBase: `${normalizeGitUrl(remoteUrl)}/blob/${commit}`,
    };
  });
}

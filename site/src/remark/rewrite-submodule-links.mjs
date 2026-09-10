import path from 'node:path';
import {visit} from 'unist-util-visit';

const SKIP_PREFIXES = ['http://', 'https://', 'mailto:', '#', '/'];

function isInside(root, target) {
  return target.startsWith(root + path.sep);
}

/**
 * This repository imports and displays documentation from external repositories.
 * These repositories are imported as submodules in `site/docs/_external/`
 * External documentation can use relative links such as `../README.md`.
 * These links will fail once rendered in the documentation site.
 * 
 * This function rewrites relative links inside imported submodule content
 * to GitHub blob URLs, using the `bases` produced by
 * `getSubmoduleLinkBases`. Links that aren't relative, or don't resolve
 * inside any known submodule, are left untouched.
 */
export default function rewriteSubmoduleLinks({bases}) {
  return (tree, file) => {
    if (!bases || bases.length === 0) {
      return;
    }

    // Only files under a known submodule root can contain links worth rewriting.
    const base = bases.find((b) => isInside(b.submoduleRoot, file.path));
    if (!base) {
      return;
    }

    visit(tree, ['link', 'image', 'definition'], (node) => {
      const url = node.url;
      if (!url || SKIP_PREFIXES.some((prefix) => url.startsWith(prefix))) {
        return;
      }

      // Split on first '#' only, so a fragment containing '#' stays intact.
      const hashIdx = url.indexOf('#');
      const pathPart = hashIdx === -1 ? url : url.slice(0, hashIdx);
      const hashPart = hashIdx === -1 ? undefined : url.slice(hashIdx + 1);
      const absTarget = path.resolve(path.dirname(file.path), pathPart);

      if (!isInside(base.submoduleRoot, absTarget)) {
        return;
      }

      const relFromSubmodule = path.relative(base.submoduleRoot, absTarget);
      node.url = `${base.repoBlobBase}/${relFromSubmodule}${hashPart ? `#${hashPart}` : ''}`;
    });
  };
}

import path from 'node:path';
import {visit} from 'unist-util-visit';

const SKIP_PREFIXES = ['http://', 'https://', 'mailto:', '#', '/'];

/**
 * Rewrites relative links inside imported submodule content (e.g. an
 * MDX-imported README) to GitHub blob URLs, using the `bases` produced by
 * `getSubmoduleLinkBases`. Links that aren't relative, or don't resolve
 * inside any known submodule, are left untouched.
 */
export default function rewriteSubmoduleLinks({bases}) {
  return (tree, file) => {
    if (!bases || bases.length === 0) {
      return;
    }

    // Only files under a known submodule root can contain links worth rewriting.
    const base = bases.find((b) => file.path.startsWith(b.submoduleRoot + path.sep));
    if (!base) {
      return;
    }

    visit(tree, ['link', 'image', 'definition'], (node) => {
      const url = node.url;
      if (!url || SKIP_PREFIXES.some((prefix) => url.startsWith(prefix))) {
        return;
      }

      const [pathPart, hashPart] = url.split('#');
      const absTarget = path.resolve(path.dirname(file.path), pathPart);

      if (!absTarget.startsWith(base.submoduleRoot + path.sep)) {
        return;
      }

      const relFromSubmodule = path.relative(base.submoduleRoot, absTarget);
      node.url = `${base.repoBlobBase}/${relFromSubmodule}${hashPart ? `#${hashPart}` : ''}`;
    });
  };
}

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

    visit(tree, ['link', 'definition'], (node) => {
      const url = node.url;
      if (!url || SKIP_PREFIXES.some((prefix) => url.startsWith(prefix))) {
        return;
      }

      const [pathPart, hashPart] = url.split('#');
      const absTarget = path.resolve(path.dirname(file.path), pathPart);

      const base = bases.find((b) => absTarget.startsWith(b.submoduleRoot + path.sep));
      if (!base) {
        return;
      }

      const relFromSubmodule = path.relative(base.submoduleRoot, absTarget);
      node.url = `${base.repoBlobBase}/${relFromSubmodule}${hashPart ? `#${hashPart}` : ''}`;
    });
  };
}

import assert from 'node:assert/strict';
import test from 'node:test';
import rewriteSubmoduleLinks from './rewrite-submodule-links.mjs';

const base = {
  submoduleRoot: '/repo/site/docs/_external/sub',
  repoBlobBase: 'https://github.com/org/sub/blob/abc',
  repoRawBase: 'https://raw.githubusercontent.com/org/sub/abc',
};

test('images get the raw base, links the blob base', () => {
  const tree = {
    type: 'root',
    children: [
      {type: 'link', url: '../README.md#setup', children: []},
      {type: 'image', url: 'img/a.png'},
      {type: 'linkReference', identifier: 'shared', children: []},
      {type: 'imageReference', identifier: 'shared'},
      {type: 'imageReference', identifier: 'logo'},
      {type: 'linkReference', identifier: 'guide', children: []},
      {type: 'definition', identifier: 'shared', url: 'img/shared.png'},
      {type: 'definition', identifier: 'logo', url: 'img/logo.png'},
      {type: 'definition', identifier: 'guide', url: 'guide.md'},
    ],
  };
  rewriteSubmoduleLinks({bases: [base]})(tree, {path: '/repo/site/docs/_external/sub/docs/page.md'});

  assert.deepEqual(
    tree.children.filter((n) => n.url).map((n) => n.url),
    [
      'https://github.com/org/sub/blob/abc/README.md#setup',
      'https://raw.githubusercontent.com/org/sub/abc/docs/img/a.png',
      'https://raw.githubusercontent.com/org/sub/abc/docs/img/shared.png',
      'https://raw.githubusercontent.com/org/sub/abc/docs/img/logo.png',
      'https://github.com/org/sub/blob/abc/docs/guide.md',
    ]
  );
});

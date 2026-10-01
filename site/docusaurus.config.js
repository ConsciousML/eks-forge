// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import path from 'node:path';
import {fileURLToPath} from 'node:url';
import 'dotenv/config';
import {themes as prismThemes} from 'prism-react-renderer';
import {getSubmoduleLinkBases} from './src/remark/get-submodule-link-bases.mjs';
import rewriteSubmoduleLinks from './src/remark/rewrite-submodule-links.mjs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// READTHEDOCS_CANONICAL_URL includes the version (and, depending on
// the project's versioning scheme, language) subpath, but Docusaurus's
// `url` must be origin-only — the subpath goes in `baseUrl` instead.
// Derived straight from the canonical URL so it tracks whatever
// versioning scheme is configured on Read the Docs.
const isReadTheDocs = process.env.READTHEDOCS === 'True';
const canonicalUrl = isReadTheDocs
  ? new URL(/** @type {string} */ (process.env.READTHEDOCS_CANONICAL_URL))
  : null;

const siteUrl = canonicalUrl ? canonicalUrl.origin : 'https://eks-forge.readthedocs.io';
const siteBaseUrl = canonicalUrl ? canonicalUrl.pathname : '/';

const siteDir = path.dirname(fileURLToPath(import.meta.url));
const submoduleLinkBases = getSubmoduleLinkBases(path.resolve(siteDir, '..'));

// Catalog module READMEs (terraform-docs output) are served under Reference > Terraform Modules
const modulesSourceDir = '_external/terragrunt-template-catalog-eks/modules';
const modulesRouteDir = 'reference/terraform_modules';
const modulesAbsDir = path.join(siteDir, 'docs', modulesSourceDir);

// App-of-apps chart READMEs (helm-docs output) are served under Reference > Helm Charts, keeping their charts/ path
const chartsSourceDir = '_external/argocd-app-of-apps-template/charts';
const chartsRouteDir = 'reference/helm_charts';
const chartsAbsDir = path.join(siteDir, 'docs', chartsSourceDir);
// The root `apps` chart lives outside charts/, served next to them as app-of-apps
const appsSourceDir = '_external/argocd-app-of-apps-template/apps';
const appsAbsDir = path.join(siteDir, 'docs', appsSourceDir);

// App-of-apps manifest READMEs are served under Reference > Manifests, keeping their manifests/ path
const manifestsSourceDir = '_external/argocd-app-of-apps-template/manifests';
const manifestsRouteDir = 'reference/manifests';
const manifestsAbsDir = path.join(siteDir, 'docs', manifestsSourceDir);

// Submodule dirs served as if they lived under docs/reference/, [source, route]
const sidebarDirRemaps = [
  [modulesSourceDir, modulesRouteDir],
  [chartsSourceDir, chartsRouteDir],
  [appsSourceDir, chartsRouteDir],
  [manifestsSourceDir, manifestsRouteDir],
];

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'EKS Forge',
  tagline: 'An open-source platform for building and operating EKS clusters',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  // Uses Read the Docs canonical URL env var, falling back for local builds
  url: siteUrl,
  baseUrl: siteBaseUrl,

  // Required for compatibility with Read the Docs
  trailingSlash: true,

  organizationName: 'ConsciousML', // Usually your GitHub org/user name.
  projectName: 'eks-forge', // Usually your repo name.

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    // terraform-docs output tweaks: Docusaurus only checks `id` for broken anchors (not `name`),
    // and the theme strips <pre> unless it wraps a <code>
    preprocessor: ({filePath, fileContent}) =>
      filePath.startsWith(modulesAbsDir + path.sep)
        ? fileContent
            .replaceAll('<a name="', '<a id="')
            .replace(/<pre>(.*?)<\/pre>/g, '<pre><code>$1</code></pre>')
        : fileContent,
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter(params);
      if (params.filePath.startsWith(modulesAbsDir + path.sep)) {
        const moduleName = path.basename(path.dirname(params.filePath));
        result.frontMatter.slug = `/${modulesRouteDir}/${moduleName}`;
        // The H1 sits below <!-- BEGIN_TF_DOCS -->, so Docusaurus can't infer the title
        result.frontMatter.title = moduleName;
        // terraform-docs output has HTML comments and raw `{` in <pre>, which MDX rejects
        result.frontMatter.mdx = {format: 'md'};
      } else if (params.filePath.startsWith(chartsAbsDir + path.sep) || params.filePath.startsWith(appsAbsDir + path.sep)) {
        const chartDir = path.dirname(params.filePath);
        const chartPath = chartDir === appsAbsDir ? 'app-of-apps' : path.relative(chartsAbsDir, chartDir);
        result.frontMatter.slug = `/${chartsRouteDir}/${chartPath}`;
        result.frontMatter.sidebar_label = path.basename(chartPath);
        // helm-docs output has an HTML comment and raw `{` in tables, which MDX rejects
        result.frontMatter.mdx = {format: 'md'};
      } else if (params.filePath.startsWith(manifestsAbsDir + path.sep)) {
        const manifestPath = path.relative(manifestsAbsDir, path.dirname(params.filePath));
        result.frontMatter.slug = `/${manifestsRouteDir}/${manifestPath}`;
        result.frontMatter.sidebar_label = path.basename(manifestPath);
        // The aggregation note is an HTML comment, which MDX rejects
        result.frontMatter.mdx = {format: 'md'};
      }
      return result;
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Agdasima:wght@400;700&display=swap',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700&display=swap',
      },
    },
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Default excludes, but '**/_*/**' is narrowed so that modules/<name>/README.md, charts/**/README.md,
          // and manifests/**/README.md become docs while the rest of _external stays partials imported by wrapper pages
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            '_external/!(terragrunt-template-catalog-eks|argocd-app-of-apps-template)/**',
            '_external/terragrunt-template-catalog-eks/!(modules)/**',
            '_external/terragrunt-template-catalog-eks/*',
            `${modulesSourceDir}/*.md`,
            `${modulesSourceDir}/*/!(README.md)`,
            `${modulesSourceDir}/*/*/**`,
            '_external/argocd-app-of-apps-template/!(charts|apps|manifests)/**',
            '_external/argocd-app-of-apps-template/*',
            `${chartsSourceDir}/**/!(README).md`,
            `${appsSourceDir}/!(README.md)`,
            `${appsSourceDir}/*/**`,
            `${manifestsSourceDir}/**/!(README).md`,
          ],
          // Place the module, chart, and manifest READMEs in the sidebar as if they lived in docs/reference/
          sidebarItemsGenerator: ({defaultSidebarItemsGenerator, docs, isCategoryIndex, ...args}) =>
            defaultSidebarItemsGenerator({
              ...args,
              // apps/README.md lands in helm_charts/ itself, keep it a page instead of the category index
              isCategoryIndex: (doc) => isCategoryIndex(doc) && doc.directories[0] !== path.basename(chartsRouteDir),
              docs: docs.map((doc) => {
                const remap = sidebarDirRemaps.find(
                  ([source]) => doc.sourceDirName === source || doc.sourceDirName.startsWith(`${source}/`)
                );
                return remap ? {...doc, sourceDirName: doc.sourceDirName.replace(...remap)} : doc;
              }),
            }),
          beforeDefaultRemarkPlugins: [[rewriteSubmoduleLinks, {bases: submoduleLinkBases}]],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.png',
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'EKS Forge',
        logo: {
          alt: 'EKS Forge Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/ConsciousML/eks-forge',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} EKS Forge. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;

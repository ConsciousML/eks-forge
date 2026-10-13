---
sidebar_position: 2
title: Run the Documentation Site
diataxis-tag: how-to
description: Start the documentation site on your machine, and build it as CI does.
---

# How to Run the Documentation Site

This guide shows you how to preview this documentation site on your machine, and build it as CI does before you push. It assumes you've followed [Set Up the Documentation Repository](/docs/documentation/set-up-the-documentation-repository/).

:::warning
This guide works for the EKS Forge repository itself, not for a fork of it. Forks aren't supported yet. If you need them, upvote the [fork support issue](https://github.com/ConsciousML/eks-forge/issues/134).
:::

## Start the Dev Server

From the root of the repository, install the dependencies of the site and start it:
```bash
cd site
npm install
npm start
```

Your browser opens the site at `http://localhost:3000`. Most changes show up without restarting the server, including the ones you make in a submodule.

If the server fails with `Failed to resolve submodule`, see [Fetch the Submodules](/docs/documentation/set-up-the-documentation-repository/#fetch-the-submodules).

## Build the Site

The dev server doesn't check your links. Before you push, build the site from `site/`, as the `link-check` job of CI and Read the Docs do:
```bash
npm run build
```

The build fails on a link to a page or an anchor that doesn't exist, and prints each one with the page it's on. Fix them, then build again.

To browse the site you built, serve it:
```bash
npm run serve
```

To host the site, see [Deploy to Read the Docs](/docs/documentation/deploy-to-read-the-docs/).

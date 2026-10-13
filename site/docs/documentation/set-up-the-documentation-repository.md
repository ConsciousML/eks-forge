---
sidebar_position: 1
title: Set Up the Documentation Repository
diataxis-tag: how-to
description: Install the tools of the documentation repository, fetch its submodules, and let CI push the documentation map.
---

# How to Set Up the Documentation Repository

This guide shows you how to set up the [EKS Forge repository](https://github.com/ConsciousML/eks-forge) to work on this documentation site: its tools, its submodules, and its CI.

:::warning
This guide works for the EKS Forge repository itself, not for a fork of it. Forks aren't supported yet. If you need them, upvote the [fork support issue](https://github.com/ConsciousML/eks-forge/issues/134).
:::

## Install the Tools

From the root of the repository, install [mise](https://mise.jdx.dev/):
```bash
curl https://mise.run | MISE_VERSION=v2026.4.0 sh
```

Then install the tools pinned in [`mise.toml`](https://github.com/ConsciousML/eks-forge/blob/main/mise.toml):
```bash
mise trust
mise install
```

To activate mise each time you start a shell, see the end of [Install the CLI Tools](/docs/quickstart/installation/#install-the-cli-tools).

If you'd rather not use mise, install [Node.js](https://nodejs.org/en/download) yourself, at the version `mise.toml` pins.

## Fetch the Submodules

The site imports most of its pages from the catalog, live, and app of apps repositories, which are [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) under `site/docs/_external/`. If you cloned the repository without `--recurse-submodules`, fetch them:
```bash
git submodule update --init --recursive
```

## Let CI Push the Documentation Map

CI generates [`documentation-map.csv`](https://github.com/ConsciousML/eks-forge/blob/main/documentation-map.csv) from the front matter of the pages, and pushes it back to your pull request. It pushes with a deploy key, for the same reason as the catalog and app of apps CI (see [Why CI Commits Generated Docs](/docs/ci-cd/#why-ci-commits-generated-docs)).

Create the key once for the repository. You need the [GitHub CLI](https://cli.github.com/) and admin access to the repository.

First, generate a key pair without a passphrase:
```bash
ssh-keygen -t ed25519 -N "" -C documentation-map -f /tmp/documentation-map-key
```

From the root of the repository, add the public key as a deploy key with write access:
```bash
gh repo deploy-key add /tmp/documentation-map-key.pub --allow-write --title documentation-map
```

Then store the private key as the `DOCUMENTATION_MAP_DEPLOY_KEY` secret:
```bash
gh secret set DOCUMENTATION_MAP_DEPLOY_KEY < /tmp/documentation-map-key
```

Delete the local copy of the key:
```bash
rm /tmp/documentation-map-key /tmp/documentation-map-key.pub
```

Finally, check that the repository has both. The first command should list `DOCUMENTATION_MAP_DEPLOY_KEY`, and the second `documentation-map` with `read-write` permission:
```bash
gh secret list
gh repo deploy-key list
```

Then run the site by following [Run the Documentation Site](/docs/documentation/run-the-documentation-site/).

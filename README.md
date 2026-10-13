![EKS Forge](site/static/img/readme-banner.png)

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GitHub Release](https://img.shields.io/github/release/eks-forge.svg?style=flat)]()
[![CI](https://github.com/ConsciousML/eks-forge/actions/workflows/ci.yaml/badge.svg)](https://github.com/ConsciousML/eks-forge/actions/workflows/ci.yaml)
[![PR's Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)

EKS Forge is an open-source platform for building and operating EKS clusters

## Getting Started

### Installation

**Option 1: Use mise (recommended)**

First, `cd` at the root of this repository.

Next, install mise:
```bash
curl https://mise.run | MISE_VERSION=v2026.4.0 sh
```

Then, install all the tools in the `mise.toml` file:
```bash
mise trust
mise install
```

Finally, run the following to automatically activate mise when starting a shell:
- For zsh:
```bash
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc && source ~/.zshrc
```
- For bash:
```bash
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc && source ~/.bashrc
```

For more information on how to use mise, read their [getting started guide](https://mise.jdx.dev/getting-started.html).

**Option 2: Install Tools Manually**
- [Node.js](https://nodejs.org/en/download) (v26.8.1)

### Submodules

This repository pulls documentation content from other repos via git submodules. If you cloned without `--recurse-submodules`, initialize them:
```bash
git submodule update --init --recursive
```

### Running the docs site

```bash
cd site
npm install
npm start
```

This starts a local dev server and opens the site at `http://localhost:3000`.

To build a static production bundle:
```bash
npm run build
```

### CI Setup

CI generates `documentation-map.csv` from the pages' front matter and pushes it back to the pull request. It pushes with a deploy key, because a push made with the default `GITHUB_TOKEN` doesn't trigger a workflow and the new commit would get no CI.

Run this once per repository (or fork). It needs the [GitHub CLI](https://cli.github.com/) and admin access to the repository.

First, generate a key pair without a passphrase:
```bash
ssh-keygen -t ed25519 -N "" -C documentation-map -f /tmp/documentation-map-key
```

Next, add the public key as a deploy key with write access:
```bash
gh repo deploy-key add /tmp/documentation-map-key.pub --allow-write --title documentation-map
```

Then, store the private key as the `DOCUMENTATION_MAP_DEPLOY_KEY` secret:
```bash
gh secret set DOCUMENTATION_MAP_DEPLOY_KEY < /tmp/documentation-map-key
```

Finally, delete the local copy of the key:
```bash
rm /tmp/documentation-map-key /tmp/documentation-map-key.pub
```

A pull request from a fork can't read the secret, so CI can't push to it. CI fails when the fork's map is out of date. Regenerate it with the script and commit the result, never edit the file by hand:
```bash
python3 .github/scripts/documentation-map.py > documentation-map.csv
```

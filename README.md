# EKS Forge

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GitHub Release](https://img.shields.io/github/release/eks-forge.svg?style=flat)]()
[![CI](https://github.com/ConsciousML/eks-forge/actions/workflows/ci.yaml/badge.svg)](https://github.com/ConsciousML/terragrunt-template-catalog-eks/actions/workflows/ci.yaml)
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

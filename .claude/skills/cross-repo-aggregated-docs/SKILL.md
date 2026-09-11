---
name: cross-repo-aggregated-docs
description: Read before reading or citing docs from sibling EKS Forge repos (terragrunt-template-catalog-eks, terragrunt-template-live-eks, argocd-app-of-apps-template).
---

Some sibling docs are aggregated into this site via MDX import (see `site/docs/_external/*`).
Marked with a top-of-file comment:
`{/* This doc is aggregated into the EKS Forge documentation site: <url>. It is not meant to be read directly in this repository. */}`

For these: links going above the source repo's root (`../../`, etc.) target this eks-forge
doc site's path layout, not a path in the source repo, don't treat as broken. Read for content,
but point users at the site URL, not the raw repo file.

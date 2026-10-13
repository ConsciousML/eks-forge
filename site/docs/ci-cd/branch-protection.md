---
sidebar_position: 3
diataxis-tag: reference
description: The GitHub ruleset protecting main in the live repository.
---

# Branch Protection

The [live repository](https://github.com/ConsciousML/eks-forge-live) protects `main` with a [GitHub ruleset](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets). This is its current configuration:

- **Enforcement status**: active
- **Target branches**: default branch
- **Restrict deletions**: enabled
- **Block force pushes**: enabled
- **Require a pull request before merging**: enabled, with 0 required approvals
- **Require status checks to pass**: enabled
  - **Required status checks**: `terratest`

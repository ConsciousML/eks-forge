---
sidebar_position: 1
---

# Infrastructure as Code

EKS Forge provisions infrastructure with [Terraform](https://developer.hashicorp.com/terraform) (TF), orchestrated by [Terragrunt](https://terragrunt.gruntwork.io/), composed in three layers, each building on the previous one:

1. [Terraform module](https://developer.hashicorp.com/terraform/language/modules): a re-usable component that creates cloud resources.
2. [Terragrunt unit](https://docs.terragrunt.com/features/units/): a wrapper over a TF module. It defines a single, deployable piece of infrastructure.
3. [Terragrunt stack](https://docs.terragrunt.com/features/stacks/): a re-usable [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph) of units.

In other words, a stack orchestrates multiple units that materialize TF modules.

See the [catalog architecture](../concepts/#catalog-architecture) for how EKS Forge structures these layers.

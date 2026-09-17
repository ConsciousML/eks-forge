---
sidebar_position: 1
diataxis-tag: explanation
---

# Infrastructure as Code

## Overview

EKS Forge provisions infrastructure with [Terraform](https://developer.hashicorp.com/terraform) (TF), orchestrated by [Terragrunt](https://terragrunt.gruntwork.io/) (TG). A module alone has no notion of "which environment" it belongs to, so this flow builds up the environment awareness a module is missing, one layer at a time:

1. [Terraform module](https://developer.hashicorp.com/terraform/language/modules): a re-usable component that creates cloud resources, the same for every environment.
2. [Terragrunt unit](#units): wraps a module with the `values` a specific deployment needs (a name, a region, a VPC CIDR, etc.), so the same module can be reused across environments.
3. [Terragrunt stack](#stacks): composes units into a re-usable [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph), so Terragrunt can apply or destroy them in dependency order instead of one at a time by hand.
4. [Environment](#environments) (`dev`, `staging`, `prod`): the same stack, instantiated with different `values`, so the exact same units and stacks can be trusted from local iteration through to production.

In other words, a stack orchestrates multiple units, each deploying the resources of their respective TF module. This is what lets the catalog's stacks be reused as-is across `dev`, `staging`, and `prod` in the [live repository](https://github.com/ConsciousML/terragrunt-template-live-eks): only the `values` fed into each unit change per environment, not the units or stacks themselves.

See the [catalog architecture](../concepts/#catalog-architecture) for how EKS Forge structures these layers.

## Terragrunt

### Units

A [Terragrunt unit](https://docs.terragrunt.com/features/units/) is a directory containing a `terragrunt.hcl` file. It is the smallest deployable unit in Terragrunt.

Take the following tree as an example:
```text
project/
├── root.hcl                 # Shared configuration
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── ec2/
│       └── ...
└── units/
    ├── vpc/
    │   └── terragrunt.hcl
    └── ec2/
        └── terragrunt.hcl
```
where `modules/` contain the TF modules and `units/` contain the TG units.

#### Wrapping a TF Module

A unit is a wrapper over a TF module. For example, `units/vpc/` points to the official [`terraform-aws-modules/vpc/aws` module](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/6.7.2):
```hcl
# units/vpc/terragrunt.hcl

include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
 source = "tfr:///terraform-aws-modules/vpc/aws?version=${values.version}"
}

inputs = {
  name = values.name
  ...
}
```

It points to the source code of the AWS VPC TF module using the `source` attribute of the [`terraform` block](https://docs.terragrunt.com/reference/hcl/blocks/#terraform).

:::note
Although the `terraform` block is used here, EKS Forge uses [OpenTofu](https://opentofu.org/) under-the-hood.
:::

The `inputs` block lets you inject input values into the TF module. `values.version` and `values.name` read from the `values` variable, a set of key/value pairs passed into the unit by whatever calls it (a [stack](#stacks), in EKS Forge). Using `values.` instead of hardcoding lets the same unit be reused across `dev`, `staging`, and `prod` with different inputs for each.

#### Shared Configuration

`root.hcl` is a configuration file that can be imported using the [`include` block](https://docs.terragrunt.com/features/units/includes/). The [`find_in_parent_folders`](https://docs.terragrunt.com/reference/hcl/functions/#find_in_parent_folders) TG built-in function searches the `root.hcl` files in the parent directories.

Here's an example of a `root.hcl` file:
```hcl
remote_state {
  backend = "s3"
  config = {
    bucket         = "my-tofu-state"
    key            = "${path_relative_to_include()}/tofu.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "my-lock-table"
  }
}
```
This configuration uses an S3 bucket to store the `.tfstate` of each unit by using their relative path from the `root.hcl` file.

#### Unit Dependencies

Units can also depend on one another. `units/ec2/` needs the VPC's id to deploy the instance into it. A [`dependency` block](https://docs.terragrunt.com/reference/hcl/blocks/#dependency) reads it straight from the `vpc` unit's [TF outputs](https://developer.hashicorp.com/terraform/language/values/outputs):
```hcl
# units/ec2/terragrunt.hcl

include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
 source = "tfr:///terraform-aws-modules/ec2-instance/aws?version=${values.version}"
}

dependency "vpc" {
  config_path = "../vpc"
}

inputs = {
  vpc_id        = dependency.vpc.outputs.vpc_id
  instance_type = values.instance_type
  ...
}
```
`config_path` points to the `vpc` unit's directory. `dependency.vpc.outputs.vpc_id` reads its `vpc_id` output and injects it as an input to `ec2`. This also tells Terragrunt that `ec2` depends on `vpc`, so it applies `vpc` first.

### Stacks

A [Terragrunt stack](https://docs.terragrunt.com/features/stacks/) is a collection of related units that can be managed together. Instead of applying each unit by hand in the right order, a stack lets Terragrunt do it automatically, following the dependencies declared between units.

The following stack composes the `vpc` and `ec2` units from the [units section](#units).

#### Define a Stack
`terragrunt.stack.hcl` files define the incorporated units, as well as the `values` fed into each one. Here's an [example of stack file](https://docs.terragrunt.com/features/stacks/explicit/#example-simple-stack-with-units):
```hcl
unit "vpc" {
  source = "git::git@github.com:acme/infrastructure-catalog.git//units/vpc?ref=v0.0.1"
  path   = "vpc"
  values = {
    name = "my-vpc"
    ...
  }
}

unit "ec2" {
  source = "git::git@github.com:acme/infrastructure-catalog.git//units/ec2?ref=v0.0.1"
  path   = "ec2"
  values = {
    instance_type = "t2.micro"
  }
}
```

#### Deploy a Stack
Before deploying the resources in a stack, run `terragrunt stack generate` in the directory containing the stack file. This resolves the stack file into concrete unit directories under `.terragrunt-stack`, each pinned to the `source` ref its unit declares:
```text
.terragrunt-stack/
├── vpc/
│   ├── terragrunt.hcl
│   └── terragrunt.values.hcl
└── ec2/
    ├── terragrunt.hcl
    └── terragrunt.values.hcl
```

Once generated, `terragrunt run --all <command>` runs any Terraform command across all the units in the stack, in dependency order:
- `terragrunt run --all init`: initialize all the Terraform modules of the stack units.
- `terragrunt run --all apply`: apply each unit in order of their dependencies. Here, `vpc` will be deployed before `ec2`, since `ec2`'s `dependency` block points at it.
- `terragrunt run --all destroy`: destroy each unit in reverse order of their dependencies. `ec2` will be destroyed first, then `vpc`. Add [`--non-interactive`](https://docs.terragrunt.com/reference/cli/global-flags/#non-interactive) to skip the `yes/no` prompt, which is why EKS Forge's CI pipelines always pass it.

:::warning[Push your changes]
After changing a module, unit, or stack, push the change to `git` and re-run `terragrunt stack generate` before the next `run --all` command. Otherwise the stack still points at the old commit, and your change won't apply.
:::

:::warning[Clean the stack]
If you remove a unit or modify a dependency between units, run `terragrunt stack clean` before regenerating. `terragrunt stack generate` doesn't remove stale files on its own, so the removed unit's old directory stays in `.terragrunt-stack` and `run --all` still picks it up.
:::

## Environments

The same stack runs in `dev`, `staging`, and `prod`, with almost the same units: only the `values` fed into them differ. Promoting a change from `dev` means running the same units in `staging` and `prod`, just parameterised differently, so what was validated in `dev` is what actually ships.

### `dev`

`dev` lives in the [catalog repository](https://github.com/ConsciousML/terragrunt-template-catalog-eks), under [`pipelines/dev/`](https://github.com/ConsciousML/terragrunt-template-catalog-eks/tree/main/pipelines/dev), and is meant for local development. Its units, defined in the [stack file](https://github.com/ConsciousML/terragrunt-template-catalog-eks/blob/main/pipelines/dev/eks/stack/terragrunt.stack.hcl), point at a local checkout via `get_repo_root()` instead of a pinned git ref, so a module or unit change applies the moment you re-run `terragrunt stack generate`, without pushing anything first.

Beyond that, `dev` closely resembles `staging` and `prod`, tuned only where local development calls for it: cost and iteration speed over production guarantees. For example, an extra [fck-nat](https://fck-nat.dev/) unit replaces the managed AWS NAT Gateway `staging` and `prod` provision, cheaper but without its managed HA. The other specific `dev` divergences are marked with `# DEV:` comments in [`pipelines/dev/eks/stack/terragrunt.stack.hcl`](https://github.com/ConsciousML/terragrunt-template-catalog-eks/blob/main/pipelines/dev/eks/stack/terragrunt.stack.hcl).

A validated `dev` change reaches `staging` and `prod` once its commit on `main` is tagged and pushed, that's the `?ref=` they pin to, so nothing reaches them until then.

### `staging`

`staging` exists to prove a change works against real infrastructure before `prod` sees it, not to iterate on the way `dev` does. It lives in the [live repository](https://github.com/ConsciousML/terragrunt-template-live-eks), with units, defined in the [stack file](https://github.com/ConsciousML/terragrunt-template-live-eks/blob/main/live/staging/eks/stack/terragrunt.stack.hcl), pinning every unit's `source` to a git tag instead of resolving it locally, that's what the "Push your changes" warning above is really about: there's no ref to pin to until you've tagged and pushed. The [`terratest` job](https://github.com/ConsciousML/terragrunt-template-live-eks/blob/main/.github/workflows/ci.yaml) deploys it per-PR, gated behind a `run-terratest` label, tests it end to end with [Terratest](https://terratest.gruntwork.io/), then tears it down automatically. Nothing in `staging` is meant to outlive the PR that spun it up.

### `prod`

`prod` is the environment running 24/7, serving real traffic, not spun up and torn down per change the way `staging` is. It also lives in the live repository, pinned to the same git tag, but the [`cd.yaml` workflow](https://github.com/ConsciousML/terragrunt-template-live-eks/blob/main/.github/workflows/cd.yaml) applies it on every merge to `main`, updating the running cluster in place rather than replacing it.
---
sidebar_position: 1
---

# Infrastructure as Code

## Overview

EKS Forge provisions infrastructure with [Terraform](https://developer.hashicorp.com/terraform) (TF), orchestrated by [Terragrunt](https://terragrunt.gruntwork.io/) (TG), composed in three layers, each building on the previous one:

1. [Terraform module](https://developer.hashicorp.com/terraform/language/modules): a re-usable component that creates cloud resources.
2. [Terragrunt unit](#units): a wrapper over a TF module. It defines a single, deployable piece of infrastructure.
3. [Terragrunt stack](#stacks): a re-usable [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph) of units.

In other words, a stack orchestrates multiple units that materialize TF modules.

See the [catalog architecture](../concepts/#catalog-architecture) for how EKS Forge structures these layers.

## Terragrunt

### Units

A [Terragrunt unit](https://docs.terragrunt.com/features/units/) is a directory containing a `terragrunt.hcl` file. It is the smallest deployable unit in Terragrunt.

Let's start with a concrete example so you can understand how TG units work. Suppose the following tree:
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

The `inputs` block lets you inject input values into the TF module. `values.version` and `values.name` read from the `values` variable, a set of key/value pairs passed into the unit by whatever calls it (a [stack](#stacks), in EKS Forge). Using `values.` instead of hardcoding lets the same unit be reused with different inputs.

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

Now, let's see how units can depend on one another. `units/ec2/` needs the VPC's id to deploy the instance into it. A [`dependency` block](https://docs.terragrunt.com/reference/hcl/blocks/#dependency) reads it straight from the `vpc` unit's [TF outputs](https://developer.hashicorp.com/terraform/language/values/outputs):
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

A [Terragrunt stack](https://docs.terragrunt.com/features/stacks/) is a collection of related units that can be managed together.

We'll reuse the `vpc` and `ec2` units from the [units section](#units).

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
Before being able to deploy the resources in a stack, we need to run `terragrunt stack generate` in the directory containing the stack file. This generates a `.terragrunt-stack` directory containing the unit directories:
```text
.terragrunt-stack/
├── vpc/
│   ├── terragrunt.hcl
│   └── terragrunt.values.hcl
└── ec2/
    ├── terragrunt.hcl
    └── terragrunt.values.hcl
```

Now, we are able to run any Terraform command across all the units with `terragrunt run --all <command>`:
- `terragrunt run --all init`: initialize all the Terraform modules of the stack units.
- `terragrunt run --all apply`: apply each unit in order of their dependencies. Here, `vpc` will be deployed before `ec2`, since `ec2`'s `dependency` block points at it.
- `terragrunt run --all destroy`: destroy each unit in reverse order of their dependencies. `ec2` will be destroyed first, then `vpc`.

:::warning[Push your changes]
After changing a module, unit, or stack, push the change to `git` and re-run `terragrunt stack generate` before the next `run --all` command. Otherwise the stack still points at the old commit, and your change won't apply.
:::

:::warning[Clean the stack]
If you remove a unit or modify a dependency between units, run `terragrunt stack clean` before regenerating. `terragrunt stack generate` doesn't remove stale files on its own, so the removed unit's old directory stays in `.terragrunt-stack` and `run --all` still picks it up.
:::

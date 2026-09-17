---
sidebar_position: 2
title: Increase EC2 Capacity
diataxis-tag: how-to
---

# How to Increase EC2 Capacity

This guide shows you how to raise the vCPU capacity available to your cluster. Three limits interact, and raising one without the others still leaves you capped:

1. The account's EC2 Service Quotas: the hard ceiling, shared by every [environment](/docs/iac/#environments) on the account.
2. The managed node group (MNG) size: the cluster's fixed baseline capacity.
3. Each Karpenter NodePool's `limits_cpu`: the elastic capacity Karpenter is allowed to add on top of the MNG, per pool.

## Check quota headroom first

Before raising either capacity below, confirm the account has room for it. Both codes are account-wide: they cover every on-demand or spot vCPU consumer across every [environment](/docs/iac/#environments), not just the stack you're changing.

```bash
aws service-quotas get-service-quota --service-code ec2 --quota-code L-1216C47A # On-Demand Standard
aws service-quotas get-service-quota --service-code ec2 --quota-code L-34B43A08 # Spot Standard
```

If the increase you're about to make would push total on-demand or spot usage past the current quota value, raise the quota first. See the [EC2 quotas reference](/docs/reference/bootstrap/aws_ec2_quotas) for inputs, and the [bootstrap guide](/docs/quickstart/bootstrap/aws_service_quotas) to submit the request.

## Raise managed node group capacity

The MNG is the cluster's always-on baseline, not autoscaled by Karpenter. To give it more room, edit its block in your [environment's stack file](/docs/iac/#environments):

```hcl
eks_managed_node_groups = {
  "${local.environment}_ng" = {
    instance_types = ["t3.medium"]
    capacity_type  = "ON_DEMAND"
    min_size       = 2
    desired_size   = 2
    max_size       = 10 # raise this
  }
}
```

See the [`eks-managed-node-group` submodule inputs](https://registry.terraform.io/modules/terraform-aws-modules/eks/aws/21.15.1/submodules/eks-managed-node-group?tab=inputs) for sizing options. `capacity_type` determines which quota code this group counts against: `ON_DEMAND` contributes to `L-1216C47A`, `SPOT` to `L-34B43A08`.

## Raise a Karpenter NodePool's limit

Raise `limits_cpu` in whichever pool's unit block applies, `critical` or `elastic`, in your [environment's stack file](/docs/iac/#environments):
```hcl
unit "karpenter_node_pool_critical" {
  values = {
    limits_cpu = "32" # raise this
  }
}
```

```hcl
unit "karpenter_node_pool_elastic" {
  values = {
    limits_cpu = "16" # raise this
  }
}
```

Each pool's `requirements` block sets its `karpenter.sh/capacity-type` (`spot` or `on-demand`), which determines which quota code the raised `limits_cpu` counts against: `on-demand` contributes to `L-1216C47A`, `spot` to `L-34B43A08`.

## Apply the change

Once the quota, MNG, or NodePool values are updated, deploy them in the desired [environment](/docs/iac/#environments), see [Deployment](/docs/quickstart/deployment/).

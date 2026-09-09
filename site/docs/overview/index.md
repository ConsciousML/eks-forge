---
sidebar_position: 1
---

# Overview

## What is EKS Forge?

EKS Forge is an open-source platform for building and operating [EKS](https://aws.amazon.com/eks/) clusters.

## Why EKS Forge?

EKS is one of the best [Kubernetes](https://kubernetes.io/) engines to orchestrate complex applications and workflows in the cloud.

Unfortunately, EKS requires significant engineering effort to support production-grade environments.
In fact, to create a healthy development ecosystem, you'll need to build features such as: multi-environment infrastructure as code (IaC), GitOps, CI/CD, monitoring, observability, alerting, and many more.

Luckily, AWS and EKS are mature environments, and the DevOps community has converged towards a common set of tools and patterns that are proven to be reliable.
For example, most teams using AWS rely on [ExternalDNS](https://github.com/kubernetes-sigs/external-dns) for synchronizing exposed services and ingresses with [Route 53](https://aws.amazon.com/route53/), [ArgoCD](https://argo-cd.readthedocs.io/en/stable/) or [FluxCD](https://fluxcd.io/) for [GitOps](https://about.gitlab.com/topics/gitops/), [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/) to manage [Elastic Load Balancers](https://aws.amazon.com/elasticloadbalancing/), and so on.

Since most teams converge on this same stack, EKS Forge offers it already built for you.
It is free, and built entirely on top of these open-source tools.
You'll be able to bootstrap a production-grade platform covering the whole development lifecycle of EKS in about a day.
More importantly, it provides documentation to understand, extend, and operate this environment yourself.

## How does EKS Forge work?

EKS Forge splits the platform into two halves that work together:
- IaC provisions the AWS resources (the cluster, VPC, IAM, etc.)
- GitOps deploys everything that runs inside the cluster ([Helm](https://helm.sh/) charts and plain manifests)

Everything is wired together as pipelines, so you can deploy a full working environment with only a few CLI commands.
These pipelines are modular and can be deployed across multiple environments:
- `dev` for developing a new feature or fix
- `staging` to test the infrastructure before production
- `prod` for the production infrastructure

You can also create divergence across environments. For example, you can use cheaper [EC2](https://aws.amazon.com/ec2/) instances and switch [NAT Gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) to [fck-nat](https://fck-nat.dev/v1.4.0/) in `dev` to cut cloud costs, while `prod` keeps managed NAT Gateways and larger EC2 instances for reliability.

EKS Forge has been designed with automation in mind. Some manual bootstrap steps are inevitable: add nameservers to your DNS registrar, create a Slack bot token for alerting, and create a [Tailscale](https://tailscale.com/) account for accessing VPC internal endpoints. However, everything that can be automated is handled by reproducible pipelines.

It also comes with a precise development workflow to enforce guardrails through CI/CD:
- code quality and security checks on PR in `dev`
- automated infrastructure testing on `staging`
- approval gates before deploying to `prod`
- automated deployment to `prod` on PR merge

## Features

Although EKS Forge aims to provide a starting platform that fits most teams, some design decisions are inevitable (ArgoCD or FluxCD? [Cloudflare](https://www.cloudflare.com/) or Tailscale? etc.).

To decide whether EKS Forge suits your needs, here's a list of its features and the tools it's built around:
- multi-environment IaC pipelines (`dev`, `staging` and `prod`) using [OpenTofu](https://opentofu.org/docs/intro/) (open-source fork of [Terraform](https://developer.hashicorp.com/terraform))
- IaC module orchestration using [Terragrunt](https://docs.terragrunt.com/getting-started/overview/)
- node autoscaling with [Karpenter](https://karpenter.sh/docs/)
- GitOps via [ArgoCD](https://argo-cd.readthedocs.io/en/stable/) following the [App of Apps pattern](https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-bootstrapping/#app-of-apps-pattern-alternative)
- [EKS Pod Identity](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html) to bind IAM roles to Kubernetes service accounts
- [Route 53](https://aws.amazon.com/route53/) for DNS routing
- [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/) (ACM) for TLS certificate issuance and renewal
- [ExternalDNS](https://kubernetes-sigs.github.io/external-dns/v0.15.0/) to synchronize exposed services and ingresses with DNS
- [External Secret Operator](https://external-secrets.io/latest/) (ESO) for synchronizing [AWS Secret Manager](https://aws.amazon.com/secrets-manager/) secrets to Kubernetes secrets
- traffic routing using [Elastic Load Balancers](https://aws.amazon.com/elasticloadbalancing/) (ELB), [Gateway API](https://gateway-api.sigs.k8s.io/docs/introduction/), and [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/) (AWS LBC)
- internal cluster endpoint access (ArgoCD, Grafana, etc.) using [Tailscale](https://tailscale.com/)
- Log aggregation using [Loki](https://grafana.com/docs/loki/latest/)
- [Alloy](https://grafana.com/docs/alloy/latest/) to collect and ship logs to Loki
- cluster and workload metrics aggregation with [Prometheus](https://prometheus.io/docs/introduction/overview/)
- observability through [Grafana](https://grafana.com/docs/grafana/latest/) dashboards
- [Alertmanager](https://prometheus.io/docs/alerting/latest/overview/) to send alerts to [Slack](https://slack.com/intl/en-gb/)
- workload resource-sizing recommendations via the [VPA](https://kubernetes.io/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/) recommender and [Goldilocks](https://goldilocks.docs.fairwinds.com/)
- [Cilium](https://docs.cilium.io/en/stable/) in [CNI-chaining mode](https://docs.cilium.io/en/stable/installation/cni-chaining-aws-cni/) for [Network Policy](https://kubernetes.io/docs/concepts/services-networking/network-policies/) enforcement
- [Hubble](https://docs.cilium.io/en/stable/observability/hubble/) for pod-to-pod network flow visibility
- [Elastic Block Store](https://aws.amazon.com/ebs/) (EBS) for persistent storage
- [fck-nat](https://fck-nat.dev/v1.4.0/) to remove [NAT Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) costs on `dev`
- [VPC Endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/vpce-interface.html) to keep AWS API traffic off the NAT gateway
- [podinfo](https://github.com/stefanprodan/podinfo) for showcasing how to deploy and publicly expose an EKS microservice
- [Github Actions](https://github.com/features/actions) for CI/CD
- [prek](https://github.com/j178/prek) for pre-commit hook enforcement (Helm lint, manifest validation, Trivy scans)

Additionally, this documentation site is powered by [Docusaurus](https://docusaurus.io/) and deployed with [Read the Docs for open-source projects](https://about.readthedocs.com/).
If you plan to host the documentation site of your private EKS Forge fork, you'll need to use a different hosting platform than Read the Docs OSS.

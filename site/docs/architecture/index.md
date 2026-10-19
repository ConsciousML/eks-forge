---
sidebar_position: 1
title: Architecture
diataxis-tag: explanation
description: How the repositories, pipelines, AWS resources, and in-cluster tools of EKS Forge fit together, across dev, staging, and prod.
---

# Architecture

EKS Forge has two sides: the platform, with the repositories and pipelines that deploy to `dev`, `staging`, and `prod`, and the infrastructure, with the AWS resources and the tools running in each environment's cluster. This page shows how the pieces of each side fit together, and points to the page that explains each one.

## Platform Architecture

![EKS Forge platform architecture: the catalog, live, and app of apps repositories, GitHub Actions, and the dev, staging, and prod environments](/img/platform-architecture.png)

Each part of the diagram has a page of its own:
- **Repositories**: the catalog provisions AWS, the app of apps repository holds what runs in the cluster, and the live repository pins both for `staging` and `prod` (see [Who Owns What](/docs/applications/how-the-app-of-apps-works/#who-owns-what)).
- **Infrastructure as code**: Terraform modules, wrapped in Terragrunt units, composed into stacks (see [Infrastructure as Code](/docs/iac/)).
- **Environments**: the same stack runs in all three, with different values (see [Environments](/docs/iac/#environments)).
- **Pipelines**: CI tests a change on `staging`, and CD applies it to `prod` (see [CI/CD](/docs/ci-cd/)).
- **GitOps**: ArgoCD deploys every chart and manifest of the app of apps repository (see [How the App of Apps Repository Works](/docs/applications/how-the-app-of-apps-works/)).

## Infrastructure Architecture

![EKS Forge infrastructure architecture: Terragrunt provisions AWS and the EKS cluster, ArgoCD deploys the tools inside it, and users reach your apps through Route 53 and the ALB](/img/infrastructure-architecture.png)

Terragrunt runs first: it creates the AWS resources and the cluster, then installs the few components ArgoCD can't deploy itself:
- ArgoCD, and its root Application, which points at the app of apps repository.
- Cilium, with Hubble, so Cilium manages every pod ArgoCD deploys, and Karpenter nodes can drop their startup taint (see [Pods Cilium Doesn't Manage](/docs/security/how-network-policies-work/#pods-cilium-doesnt-manage)).
- Karpenter, since ArgoCD itself runs on its `critical` nodes (see [Three Kinds of Nodes](/docs/compute/how-pods-are-scheduled/#three-kinds-of-nodes)).

ArgoCD then deploys everything else from the app of apps repository: the AWS Load Balancer Controller, ExternalDNS, the External Secrets Operator, the monitoring stack, the Tailscale operator, and your apps.

Most of them also need AWS resources: an IAM role, an S3 bucket, a secret, or a certificate. Terragrunt creates these first, so they exist when ArgoCD deploys the component that uses them. It then hands their names and ARNs to ArgoCD's root Application, which passes each one to its chart (see [`appParams` Injection](/docs/applications/how-the-app-of-apps-works/#appparams-injection)).

Each part of the diagram has a page of its own:
- **Compute**: Karpenter launches the nodes your pods run on (see [How Pods Are Scheduled](/docs/compute/how-pods-are-scheduled/)).
- **Network security**: Cilium denies all traffic by default, and allows each flow a pod needs (see [How Network Policies Work](/docs/security/how-network-policies-work/)).
- **Ingress**: Route 53, the public and private ALBs, and ExternalDNS route a hostname to your app (see [How Ingress Works](/docs/networking/how-ingress-works/)).
- **Private access**: Tailscale lets developers reach the internal tools (see [How Tailscale Works](/docs/networking/tailscale/)).
- **Observability**: Prometheus collects metrics, Alloy ships logs to Loki, Hubble shows the flows Cilium sees, and Alertmanager sends alerts to Slack (see [How Monitoring Works](/docs/monitoring/how-monitoring-works/) and [How Alerting Works](/docs/monitoring/alerting/how-alerting-works/)).

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="site/static/img/readme-banner-dark.png">
    <img alt="EKS Forge" src="site/static/img/readme-banner-light.png" width="480">
  </picture>
</p>

<p align="center">
  An open-source platform for building and operating Kubernetes on AWS
</p>

<p align="center">
  <a href="https://eks-forge.readthedocs.io/latest/docs/quickstart/">Quickstart</a>&nbsp;|&nbsp;
  <a href="https://eks-forge.readthedocs.io/latest/docs/overview/">Documentation</a>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/Apache-2.0"><img alt="License" src="https://img.shields.io/badge/License-Apache_2.0-blue.svg"></a>
  <img alt="GitHub Release" src="https://img.shields.io/github/release/eks-forge.svg?style=flat">
  <a href="https://github.com/ConsciousML/eks-forge/actions/workflows/ci.yaml"><img alt="CI" src="https://github.com/ConsciousML/eks-forge/actions/workflows/ci.yaml/badge.svg"></a>
  <a href="http://makeapullrequest.com"><img alt="PR's Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat"></a>
</p>

EKS Forge is a production-ready EKS platform that you can understand, extend, and operate yourself. It's a template you fork, not a dependency you install, and you can have it running in about a day.

## What's Inside

- [Infrastructure as code](https://eks-forge.readthedocs.io/latest/docs/iac/) (IaC) with OpenTofu and Terragrunt
- Deploy the same stack across multiple IaC [environments](https://eks-forge.readthedocs.io/latest/docs/iac/#environments) (`dev`, `staging`, and `prod`)
- GitOps with ArgoCD using the [App of Apps pattern](https://eks-forge.readthedocs.io/latest/docs/applications/how-the-app-of-apps-works/)
- [Node autoscaling](https://eks-forge.readthedocs.io/latest/docs/compute/how-pods-are-scheduled/) with Karpenter
- [Monitoring](https://eks-forge.readthedocs.io/latest/docs/monitoring/how-monitoring-works/) and alerting with Prometheus, Grafana, and Loki
- [Network policies](https://eks-forge.readthedocs.io/latest/docs/security/how-network-policies-work/) with Cilium
- [CI/CD](https://eks-forge.readthedocs.io/latest/docs/ci-cd/) with GitHub Actions

For the full list, see [Features](https://eks-forge.readthedocs.io/latest/docs/overview/#features).

## Get Started

Four tutorials walk you through the platform, in order:
1. [Quickstart](https://eks-forge.readthedocs.io/latest/docs/quickstart/): deploy a [fully-fledged](https://eks-forge.readthedocs.io/latest/docs/overview/#cluster-features) EKS cluster in the `dev` environment
2. [Monitor Your Cluster](https://eks-forge.readthedocs.io/latest/docs/monitoring/get-started/): explore its metrics, logs, network flows, and alerts
3. [Deploy Your Applications](https://eks-forge.readthedocs.io/latest/docs/applications/get-started/): ship a change to the cluster through ArgoCD
4. [Production Deployment](https://eks-forge.readthedocs.io/latest/docs/deployment/get-started/): test on `staging`, then promote a release to `prod`

## Architecture

Three repositories deploy the same stack to `dev`, `staging`, and `prod`: Terragrunt provisions AWS and the cluster, and ArgoCD deploys what runs inside it. For how the pieces fit together, see [Architecture](https://eks-forge.readthedocs.io/latest/docs/architecture/).

```mermaid
---
title: EKS Forge architecture
---
flowchart TB
    eng(["Platform engineer"])
    users(["Users"])
    slack["Slack"]
    tailnet["Tailscale"]

    subgraph github["GitHub"]
        catalog["catalog<br/>modules, units, dev stack"]
        live["live<br/>staging and prod stacks"]
        aoa["app of apps<br/>charts and manifests"]
        gha["GitHub Actions<br/>CI/CD"]
    end

    subgraph envs["Environments"]
        dev["dev<br/>deployed from your machine"]
        staging["staging<br/>created, tested, destroyed"]
        prod["prod<br/>updated in place"]
    end

    eng -->|"pushes"| github
    catalog -->|"tag pinned by"| live
    live -->|"triggers"| gha
    eng -->|"terragrunt apply"| dev
    gha -->|"Terratest on pull request"| staging
    gha -->|"CD on merge"| prod

    subgraph env["One environment"]
        tg["OpenTofu + Terragrunt"]
        subgraph aws["AWS"]
            r53["Route 53"]
            acm["ACM"]
            alb["ALB<br/>public and private"]
            sm["Secrets Manager"]
            s3["S3"]
            ec2["EC2"]
        end
        subgraph eks["EKS cluster"]
            argocd["ArgoCD"]
            karpenter["Karpenter"]
            cilium["Cilium + Hubble"]
            lbc["AWS LBC<br/>Gateway API"]
            extdns["ExternalDNS"]
            eso["External Secrets"]
            tsop["Tailscale operator"]
            prom["Prometheus<br/>Alertmanager"]
            alloy["Alloy"]
            loki["Loki"]
            grafana["Grafana"]
            app["Your apps"]
        end
    end

    envs -.->|"each runs"| env
    tg -->|"creates"| aws
    tg -->|"installs"| argocd
    tg -->|"installs"| karpenter
    tg -->|"installs"| cilium
    aoa -->|"synced by"| argocd
    argocd -->|"deploys the rest"| eks
    karpenter -->|"launches nodes"| ec2
    lbc -->|"creates"| alb
    acm -->|"certificate"| alb
    extdns -->|"writes records"| r53
    eso -->|"reads secrets"| sm
    alloy -->|"ships logs"| loki
    loki -->|"stores"| s3
    prom -->|"queried by"| grafana
    loki -->|"queried by"| grafana
    prom -->|"alerts"| slack
    cilium -->|"filters traffic"| app
    users --> r53
    r53 --> alb
    alb --> app
    eng -->|"VPN"| tailnet
    tailnet --> tsop
    tsop -->|"VPC route"| alb
```

## Support

Support is provided on a best-effort basis. If you have feedback, feature ideas, or wish to report a bug, please use the [issues](https://github.com/ConsciousML/eks-forge/issues) of this repository.

## License

EKS Forge is licensed under the [Apache License 2.0](LICENSE).

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="site/static/img/readme-banner-dark.png">
    <img alt="EKS Forge" src="site/static/img/readme-banner-light.png" width="480">
  </picture>
</p>

<p align="center">
  An open-source platform for building and operating EKS clusters
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

EKS Forge offers a production-grade platform that you can understand, extend, and operate yourself. It covers the whole development lifecycle of [EKS](https://aws.amazon.com/eks/), and you can get started in about a day.

## What's Inside

- [Infrastructure as code](https://eks-forge.readthedocs.io/latest/docs/iac/) with OpenTofu and Terragrunt
- Deploy the same stack across multiple [environments](https://eks-forge.readthedocs.io/latest/docs/iac/#environments) (`dev`, `staging`, and `prod`)
- GitOps with ArgoCD using the [app of apps pattern](https://eks-forge.readthedocs.io/latest/docs/applications/how-the-app-of-apps-works/)
- [Node autoscaling](https://eks-forge.readthedocs.io/latest/docs/compute/how-pods-are-scheduled/) with Karpenter
- [Monitoring](https://eks-forge.readthedocs.io/latest/docs/monitoring/how-monitoring-works/) and alerting with Prometheus, Grafana, and Loki
- [Network policies](https://eks-forge.readthedocs.io/latest/docs/security/how-network-policies-work/) with Cilium
- [CI/CD](https://eks-forge.readthedocs.io/latest/docs/ci-cd/) with GitHub Actions

For the full list, see [Features](https://eks-forge.readthedocs.io/latest/docs/overview/#features).

## When Not to Use It

- You don't have a platform or DevOps team
- Your stack relies on other tools (e.g. FluxCD instead of ArgoCD, Datadog instead of Prometheus)
- Several teams deploy to the same environments (see [Limitations & Improvements](https://eks-forge.readthedocs.io/latest/docs/ci-cd/limitations-and-improvements/))

## License

EKS Forge is licensed under the [Apache License 2.0](LICENSE).

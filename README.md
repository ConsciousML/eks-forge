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

EKS Forge offers a production-ready [EKS](https://aws.amazon.com/eks/) platform that you can fork and extend.

## What's Inside

- [infrastructure as code](https://eks-forge.readthedocs.io/latest/docs/iac/) with OpenTofu and Terragrunt
- `dev`, `staging`, and `prod` environments
- GitOps with ArgoCD
- node autoscaling with Karpenter
- [monitoring](https://eks-forge.readthedocs.io/latest/docs/monitoring/how-monitoring-works/) and alerting with Prometheus, Grafana, and Loki
- [network policies](https://eks-forge.readthedocs.io/latest/docs/security/how-network-policies-work/) with Cilium
- [CI/CD](https://eks-forge.readthedocs.io/latest/docs/ci-cd/) with GitHub Actions

For the full list, see [Features](https://eks-forge.readthedocs.io/latest/docs/overview/#features).

## When Not to Use It

- you don't have a platform or DevOps team
- your stack relies on other tools (e.g. FluxCD instead of ArgoCD, Datadog instead of Prometheus)
- several teams deploy to the same environments (see [Limitations & Improvements](https://eks-forge.readthedocs.io/latest/docs/ci-cd/limitations-and-improvements/))

## License

EKS Forge is licensed under the [Apache License 2.0](LICENSE).

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

[EKS](https://aws.amazon.com/eks/) is one of the best [Kubernetes](https://kubernetes.io/) engines to orchestrate complex applications and workflows in the cloud. Unfortunately, it requires significant engineering effort to support production-grade environments. In fact, to create a healthy development ecosystem, you'll need to build features such as: multi-environment infrastructure as code (IaC), GitOps, CI/CD, monitoring, observability, alerting, and many more.

Luckily, the DevOps community has converged towards a common set of tools and patterns that are proven to be reliable. Since most teams converge on this same stack, EKS Forge offers it already built for you. It is free, and built entirely on top of open-source tools. You'll be able to bootstrap a production-grade platform covering the whole development lifecycle of EKS in about a day. More importantly, it provides documentation to understand, extend, and operate this environment yourself.

## What's Inside

EKS Forge comes with the following, already wired together:
- [infrastructure as code](https://eks-forge.readthedocs.io/latest/docs/iac/) with OpenTofu modules, and Terragrunt pipelines for the `dev`, `staging`, and `prod` environments
- GitOps with ArgoCD and an [app of apps repository](https://eks-forge.readthedocs.io/latest/docs/applications/how-the-app-of-apps-works/)
- [pod scheduling](https://eks-forge.readthedocs.io/latest/docs/compute/how-pods-are-scheduled/) on nodes autoscaled by Karpenter, and resource-sizing recommendations with Goldilocks
- [public and private gateways](https://eks-forge.readthedocs.io/latest/docs/applications/expose-an-app/) with Gateway API, the AWS Load Balancer Controller, ExternalDNS, and ACM
- [network policies](https://eks-forge.readthedocs.io/latest/docs/security/how-network-policies-work/) enforced by Cilium, private endpoints behind [Tailscale](https://eks-forge.readthedocs.io/latest/docs/security/tailscale/), and secrets synced from AWS Secrets Manager by the External Secrets Operator
- [monitoring](https://eks-forge.readthedocs.io/latest/docs/monitoring/how-monitoring-works/) with Prometheus, Grafana, Loki, Alloy, and Hubble, and [alerting](https://eks-forge.readthedocs.io/latest/docs/monitoring/alerting/how-alerting-works/) to Slack with Alertmanager
- [CI/CD](https://eks-forge.readthedocs.io/latest/docs/ci-cd/) with GitHub Actions: code quality and security checks on pull requests, automated infrastructure testing on `staging`, approval gates before `prod`, and automated deployment to `prod` on merge

For the full list, see [Features](https://eks-forge.readthedocs.io/latest/docs/overview/#features).

## When Not to Use It

EKS Forge targets teams developing infrastructure for complex systems. It may not be the right fit if:
- you don't have a platform or DevOps team, and don't need the advanced functionality this project offers. You're better off building your infrastructure yourself.
- your existing stack already relies on different tools than the ones EKS Forge is built around (e.g. FluxCD instead of ArgoCD, Datadog instead of the Prometheus stack). Adopting it may cost more than it saves.
- several teams deploy to the same environments. The CI/CD is designed for small teams shipping a few changes a day, so read [Limitations & Improvements](https://eks-forge.readthedocs.io/latest/docs/ci-cd/limitations-and-improvements/) first.

## License

EKS Forge is licensed under the [Apache License 2.0](LICENSE).

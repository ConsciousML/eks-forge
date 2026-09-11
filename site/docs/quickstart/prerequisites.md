---
sidebar_position: 2
title: Prerequisites
---

## AWS Account
EKS Forge deploys and manages AWS resources. You'll need an AWS account. If you don't, please start by [creating an account](https://signin.aws.amazon.com/signup?request_type=register).

If your account belongs to an organization, ask your AWS administrator to attach the [`AdministratorAccess`](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AdministratorAccess.html) IAM policy to your identity.

## GitHub Account
It uses GitHub for hosting its code source and [GitHub Actions](https://github.com/features/actions) for [CI/CD](../ci-cd/index.md). Naturally, you'll need a GitHub account. If you don't, please [create an account](https://github.com/signup).

## Operating System
A Unix-like shell is required. Make sure you're on one these operating systems:
- Linux distros ([Ubuntu](https://ubuntu.com/download), [Debian](https://www.debian.org/distrib/), etc.)
- [MacOS](https://www.apple.com/macos/)
- [Windows WSL](https://learn.microsoft.com/en-us/windows/wsl/install)

## Domain Name
It deploys multiple private (e.g [ArgoCD](https://argo-cd.readthedocs.io/en/stable/), [Prometheus](https://prometheus.io/), etc.) and public ([podinfo](https://github.com/stefanprodan/podinfo)) endpoints.

You'll need a domain and access to its registrar so these endpoints can be deployed (e.g `https://argocd.private.<env>.<your-domain.com>`). If you don't have one, either:
- buy a domain name from a domain registrar (e.g [Namecheap](https://www.namecheap.com/), [GoDaddy](https://www.godaddy.com/domains), [Cloudflare](https://domains.cloudflare.com/), etc.)
- or register a free domain name at [`nic.eu.org`](https://nic.eu.org/).

Any registrar works, as long as it lets you add [NS records](https://www.cloudflare.com/learning/dns/dns-records/dns-ns-record/) to delegate each environment subdomain to AWS.

## Tailscale Account
For security reasons, internal developer tools aren't exposed (e.g [Grafana](https://grafana.com/oss/) for dashboards, [Hubble](https://github.com/cilium/hubble) for traffic flow, etc.) to the public internet. You'll use [Tailscale](https://tailscale.com/) as a VPN to reach private endpoints inside the [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html). If you don't have a Tailscale Account, please [create one](https://login.tailscale.com/start).

## Slack Workspace
EKS Forge sends [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) notifications to [Slack](https://slack.com/) so you can be aware of on-going issues in your cluster. You'll need a Slack Workspace to be able to receive alerts. If you don't have one, [follow the getting started](https://slack.com/intl/en-gb/help/articles/217626298-Getting-started-for-workspace-creators).
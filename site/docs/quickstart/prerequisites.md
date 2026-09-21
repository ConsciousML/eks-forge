---
sidebar_position: 2
title: Prerequisites
diataxis-tag: tutorial
---

## AWS Account
You'll need an AWS account to deploy and manage cloud resources. If you don't have one, [create an account](https://signin.aws.amazon.com/signup?request_type=register).

If your account belongs to an organization, ask your AWS administrator to attach the [`AdministratorAccess`](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AdministratorAccess.html) IAM policy to your identity.

## GitHub Account
You'll need a GitHub account to host your code and run [CI/CD](../ci-cd/index.md) with [GitHub Actions](https://github.com/features/actions). If you don't have one, [create an account](https://github.com/signup).

You'll also need an SSH key added to your GitHub account, since your repositories and Terragrunt pull code from GitHub over SSH. If you don't have one, follow [GitHub's SSH guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh). Verify your setup with:
```bash
ssh -T git@github.com
```
You should see `Hi <your-username>! You've successfully authenticated`.

## Operating System
A Unix-like shell is required. Make sure you're on one these operating systems:
- Linux distros ([Ubuntu](https://ubuntu.com/download), [Debian](https://www.debian.org/distrib/), etc.)
- [MacOS](https://www.apple.com/macos/)
- [Windows WSL](https://learn.microsoft.com/en-us/windows/wsl/install)

## Domain Name
You'll need a domain and access to its registrar to expose your cluster's private (e.g [ArgoCD](https://argo-cd.readthedocs.io/en/stable/), [Prometheus](https://prometheus.io/), etc.) and public ([podinfo](https://github.com/stefanprodan/podinfo)) endpoints (e.g `https://argocd.private.<env>.<your-domain.com>`). If you don't have one, either:
- buy a domain name from a domain registrar (e.g [Namecheap](https://www.namecheap.com/), [GoDaddy](https://www.godaddy.com/domains), [Cloudflare](https://domains.cloudflare.com/), etc.)
- or register a free domain name at [`nic.eu.org`](https://nic.eu.org/).

Any registrar works, as long as it lets you add [NS records](https://www.cloudflare.com/learning/dns/dns-records/dns-ns-record/) to delegate each [environment](../iac/index.md#environments) subdomain to AWS.

## Tailscale Account
You'll need a [Tailscale](https://tailscale.com/) account to reach private developer tools (e.g [Grafana](https://grafana.com/oss/) for dashboards, [Hubble](https://github.com/cilium/hubble) for traffic flow, etc.) over VPN inside the [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html). If you don't have one, [create one](https://login.tailscale.com/start).

## Slack Workspace
You'll need a Slack Workspace to receive [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) notifications about on-going issues in your cluster. If you don't have one, [follow the getting started guide](https://slack.com/intl/en-gb/help/articles/217626298-Getting-started-for-workspace-creators).
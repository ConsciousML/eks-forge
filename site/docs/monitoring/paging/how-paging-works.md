---
sidebar_position: 3
title: How Paging Works
diataxis-tag: explanation
description: Why only SLO page alerts page, and how they reach PagerDuty. Covers opt-in paging per environment, the routing key from the bootstrap to Alertmanager, the service region, and incidents that open and close themselves.
---

# How Paging Works

EKS Forge pages the person on call through [PagerDuty](https://www.pagerduty.com/) for SLO page alerts only, and only in the environments that turn paging on. Every other alert stays in Slack. This page explains why, and how a page goes from Alertmanager to PagerDuty.
To get paged yourself, follow [Get Your First Page](/docs/monitoring/paging/get-your-first-page/). To choose who gets paged, see [Manage On-Call in PagerDuty](/docs/monitoring/paging/manage-on-call-in-pagerduty/).

## Why Only SLO Page Alerts Page
A page notifies someone right away, at any hour, so it has to be worth it. Of all the alerts EKS Forge ships, only an SLO's page alert, the one with `severity: critical`, meets that bar (see [Pages and Tickets](/docs/monitoring/paging/how-slo-alerting-works/#pages-and-tickets) and [Multi-Window Multi-Burn-Rate Alerts](/docs/monitoring/paging/how-slo-alerting-works/#multi-window-multi-burn-rate-alerts)).

The reason is that an SLO alert reports a symptom, not a cause. When podinfo's page alert fires, its users are getting errors now, and fast enough to burn the error budget in days. A cause alert like `KubePodCrashLooping` says something is wrong inside the cluster, but not whether anyone notices: a replica can restart in a loop while the others serve every request. The SRE book makes the same split in [Symptoms Versus Causes](https://sre.google/sre-book/monitoring-distributed-systems/#symptoms-versus-causes-g0sEi4).

Every other alert stays in its Slack channel, the SLO ticket alerts included (see [How Alerting Works](/docs/monitoring/alerting/how-alerting-works/)). They still matter once someone is paged: a page says users are failing, and the cause alerts firing next to it in Slack help find why.

The trade-off is that a cause that will hurt users later, like a disk filling up, pages nobody until it burns the error budget. Until then, it only reaches Slack, so someone still has to read the `critical` channels.

## Paging Is Opt-In per Environment
The `slo` alerts with `severity: critical` have a route of their own in Alertmanager, like every pair of `component` and `severity` (see [Routing by Component, Then Severity](/docs/monitoring/alerting/how-alerting-works/#routing-by-component-then-severity)). The `pagerduty.enabled` value of the `kube-prometheus-stack` chart picks its receiver. Off, it's `slo-critical`, which posts to `#<environment>-slo-critical`. On, it's `slo-critical-pagerduty`, which posts to the same channel and also pages PagerDuty.

```mermaid
---
title: Routing an slo page alert
---
flowchart LR
    alert(["slo alert<br/>severity: critical"]) --> enabled{"pagerduty.enabled?"}
    enabled -->|"no"| slack["#<environment>-slo-critical"]
    enabled -->|"yes"| both["#<environment>-slo-critical<br/>and PagerDuty"]
```

Each environment's EKS stack sets the value. In the catalog, the `dev` stack reads it from [`PAGERDUTY_ENABLED`](/docs/reference/environment_variable/#pagerduty_enabled), which defaults to `false`. A `dev` cluster is rebuilt and broken on purpose, and CI deploys the same stack to test a change, so neither should wake anyone unless you ask for it. In the live repository, `prod` sets it to `true`, and `staging` to `false`: only `prod` serves real users.

The trade-off is that an SLO burning in `staging` or `dev` only reaches Slack. A change that breaks podinfo in `staging` shows up in `#staging-slo-critical`, and nobody is paged before it reaches `prod`.

## From the Routing Key to a Page
PagerDuty takes alerts through its [Events API v2](https://developer.pagerduty.com/docs/events-api-v2-overview), and each event names a [service](https://support.pagerduty.com/main/docs/services-and-integrations) by its routing key, also called its integration key. The [PagerDuty Bootstrap](/docs/quickstart/bootstrap/pagerduty/) creates one service per environment, like `dev-eks-forge`, with an Events API v2 integration. It stores the integration's key in AWS Secrets Manager, in the `<environment>-alertmanager-pagerduty` secret, under the `routing_key` key.

The key reaches Alertmanager like the Slack bot token does. The `alertmanager-pagerduty-secrets` app runs the [External Secrets Operator](https://external-secrets.io/), which syncs the secret into the `alertmanager-pagerduty` Kubernetes Secret, in the `monitoring` namespace. Alertmanager mounts it, and the `slo-critical-pagerduty` receiver reads the key from that file with `routing_key_file`. The key never sits in git or in the Helm values.

```mermaid
---
title: From the PagerDuty Bootstrap to a page
---
flowchart LR
    bootstrap["PagerDuty Bootstrap"] -->|"stores the routing key in"| sm["Secrets Manager<br/>dev-alertmanager-pagerduty"]
    sm -->|"synced by the External<br/>Secrets Operator into"| secret["Secret<br/>alertmanager-pagerduty"]
    secret -->|"mounted by"| am["Alertmanager"]
    am -->|"sends page events to"| pd["PagerDuty service<br/>dev-eks-forge"]
```

Every environment gets a service and a secret, those that never page included. Alertmanager mounts the `alertmanager-pagerduty` Secret whatever `pagerduty.enabled` says, and its pod doesn't start until the Secret exists. Turning paging on is then only a change of value, with no bootstrap to run first. The trade-off is that PagerDuty lists services that never page, like the one for CI.

The chart takes two values about PagerDuty, `pagerduty.enabled` and `pagerduty.eventsUrl`, and neither is written in the app of apps repository. The catalog injects both at deploy time, like the environment's name (see [`appParams` Injection](/docs/applications/how-the-app-of-apps-works/#appparams-injection)).

## The Service Region
A PagerDuty account lives in the US or in the EU, chosen at signup, and each region has its own Events API endpoint. Alertmanager has to call the one of your account, so the catalog turns [`PAGERDUTY_SERVICE_REGION`](/docs/reference/environment_variable/#pagerduty_token-and-pagerduty_service_region) into `pagerduty.eventsUrl`: the EU endpoint for `eu`, and the US one otherwise.

On your machine, a US account leaves the variable empty. CI and CD read it from a GitHub Actions secret instead, and a GitHub secret can't be empty, so the bootstrap stores the US region as `us`. Since only `eu` is checked for, `us` and an empty value pick the same endpoint.

## Incidents Open and Close Themselves
Alertmanager sends a trigger event when the page alert fires, and PagerDuty opens an incident on the environment's service. The incident's title is the alert's `summary` annotation, like `podinfo is burning its availability error budget`. It's often all the person on call reads before acting, on a lock screen, so a summary has to make sense on its own.

The receiver also sets `send_resolved`. When the alert resolves, Alertmanager sends a resolve event, and PagerDuty resolves the incident. Nobody has to close it by hand.

The limit is that only an Alertmanager that still routes to PagerDuty sends that event. If paging is turned off while an incident is open, nothing closes it.

For the values behind the PagerDuty receiver, see the [`kube-prometheus-stack` Helm Chart](/docs/reference/helm_charts/monitoring/kube-prometheus-stack/) reference. For the pipelines that create the services and the GitHub secret, see the [PagerDuty Service](/docs/reference/bootstrap/pagerduty_service/) and [PagerDuty GitHub Secrets](/docs/reference/bootstrap/pagerduty_github_secrets/) references.

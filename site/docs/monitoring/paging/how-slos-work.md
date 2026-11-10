---
sidebar_position: 4
title: How SLOs Work
diataxis-tag: explanation
description: How podinfo's SLOs turn failed requests into page and ticket alerts. Covers SLIs, SLOs, error budgets, burn rates, multi-window multi-burn-rate alerts, page and ticket severities, Sloth, and the SLO dashboards.
---

# How SLOs Work

EKS Forge alerts on service level objectives (SLOs) through [Sloth](https://sloth.dev/), which turns each SLO into a page alert and a ticket alert. Its only SLOs are those of [podinfo](https://github.com/stefanprodan/podinfo), the sample app it deploys. They show the pattern to follow when you add SLOs for your own app. This page explains the concepts behind them, from the SLI to the burn rate, and how Sloth applies them.
To see a page alert fire, follow [Get Your First Page](/docs/monitoring/paging/get-your-first-page/).

## Pages and Tickets
A [page](https://sre.google/sre-book/monitoring-distributed-systems/#alert) is an alert that notifies the person [on call](https://sre.google/sre-book/being-on-call/) right away, by phone or push notification, at any hour. It's for a problem that needs someone now. A ticket is an alert that waits for someone to pick it up during working hours.

## Service Level Indicator (SLI)
A [service level indicator](https://sre.google/sre-book/service-level-objectives/#indicators-o8seIAcZ) (SLI) measures one aspect of the service that is provided, like the share of requests that succeed or how fast they complete. The SRE workbook recommends writing it as the ratio of good events over total events. SLO alerts use its complement, the error ratio:

```text
SLI = bad events / total events
```

It ranges from `0`, when no event failed, to `1`, when every event did.

For podinfo's availability, a bad event is a request that fails with a `5xx`. If podinfo serves 2,000 requests in an hour and 10 of them fail, its SLI over that hour is `10 / 2000 = 0.005`, or 0.5%.

Counting failures alone wouldn't work, because the count grows with traffic. Fifty failed requests are an outage at a hundred requests a minute, and noise at a hundred thousand. Dividing by the total gives the SLI the same meaning at any traffic level.

For how to pick what to measure, see [Indicators in Practice](https://sre.google/sre-book/service-level-objectives/#indicators-in-practice-pWs7iE) in the SRE book.

## Service Level Objective (SLO)
An [SLO](https://sre.google/sre-book/service-level-objectives/#objectives-g0s1tdcz) is a target value for an SLI, measured over a time window. Podinfo's availability SLO is 99%: at least 99% of its requests must succeed over 30 days, so its SLI must stay at or below 1%.

The objective is never 100%. Past a point, users can't tell a more reliable service from a less reliable one, while each extra nine costs more and slows down changes (see [Embracing Risk](https://sre.google/sre-book/embracing-risk/)). For how to pick a target, see [Implementing SLOs](https://sre.google/workbook/implementing-slos/).

## Error Budget
The [error budget](https://sre.google/sre-book/embracing-risk/#forming-your-error-budget-vJs8iDio) is the share of events the SLO allows to fail: `1 - SLO`. For podinfo's 99% SLO, it's 1% of the requests over 30 days. At a million requests in that window, 10,000 of them can fail before the SLO is missed.

The budget balances reliability against changes. As long as some budget is left, releases go on. Once it's spent, the team focuses on reliability until the service is back within its SLO. The SRE workbook formalizes this as an [Error Budget Policy](https://sre.google/workbook/error-budget-policy/).

## Error Rate and Burn Rate
The error rate is the SLI over a window shorter than the SLO's, like the share of requests that failed in the last hour. It shows how the service is doing now, while the SLO covers the full 30 days.

The [burn rate](https://sre.google/workbook/alerting-on-slos/#4-alert-on-burn-rate) is how fast the service consumes its error budget, relative to the SLO:

```text
burn rate = error rate / error budget
```

A burn rate of `1` consumes the budget in exactly 30 days, and a burn rate of `2` in 15 days. For podinfo's 99% SLO, an hour in which 2% of the requests failed gives a burn rate of `0.02 / 0.01 = 2`.

The alerts use the burn rate, not the error rate, because the same error rate means different things for different SLOs: 2% of failed requests is a burn rate of `2` on a 99% SLO, but of `20` on a 99.9% SLO. The burn rate puts every SLO on the same scale, so the same thresholds work for all of them.

## Multi-Window Multi-Burn-Rate Alerts
A [multiwindow, multi-burn-rate alert](https://sre.google/workbook/alerting-on-slos/#6-multiwindow-multi-burn-rate-alerts) combines several conditions. Each condition pairs a burn rate threshold with two windows, a long one and a short one, and is true when the burn rate is above the threshold over both. A high threshold over short windows catches fast failures, and a low threshold over long windows catches slow ones.

```mermaid
---
title: One condition of a multi-window alert
---
flowchart LR
    long["Burn rate over the long window,<br/>like 1h"] --> longcheck{"Above the threshold?"}
    short["Burn rate over the short window,<br/>like 5m"] --> shortcheck{"Above the threshold?"}
    longcheck -->|"yes"| both{"Both yes?"}
    shortcheck -->|"yes"| both
    both -->|"yes"| fire(["Alert fires"])
```

Podinfo's SLOs use the four conditions the SRE workbook recommends for a 30-day SLO (see [Recommended Parameters](https://sre.google/workbook/alerting-on-slos/#recommended_parameters_for_an_slo_based_a)):

| Alert | Burn rate | Long window | Short window | Budget consumed over the long window |
|---|---|---|---|---|
| Page | 14.4 | 1 hour | 5 minutes | 2% |
| Page | 6 | 6 hours | 30 minutes | 5% |
| Ticket | 3 | 1 day | 2 hours | 10% |
| Ticket | 1 | 3 days | 6 hours | 10% |

Each alert fires when either of its two conditions is true.

Each SLO has one page alert and one ticket alert. The page alert carries `severity: critical`: when it fires, it notifies the person on call right away. The ticket alert carries `severity: warning`: when it fires, it waits for someone to pick it up during working hours.

While the page alert fires, its ticket alert is muted. Both share the same `alertname`, and the default [inhibit rules](https://prometheus.io/docs/alerting/latest/configuration/#inhibition-related-settings) of `kube-prometheus-stack` mute a `warning` alert while a `critical` alert with the same `alertname` fires. The ticket would only repeat the page.

## Sloth
An SLO alert needs a recording rule for the SLI over each window, and alert rules that compare eight of them to thresholds computed from the objective. Writing them by hand for each SLO is repetitive and error-prone. [Sloth](https://sloth.dev/) generates them from a short spec, the same way for every SLO.

The spec is a `PrometheusServiceLevel` custom resource. Each SLO in it sets its objective, and its SLI as two [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) queries: `errorQuery` for the bad events, and `totalQuery` for all of them. Here is podinfo's availability SLO, from [`manifests/podinfo/podinfo-slo.yaml`](https://github.com/ConsciousML/eks-forge-app-of-apps/blob/main/manifests/podinfo/podinfo-slo.yaml):
```yaml
- name: requests-availability
  objective: 99
  sli:
    events:
      errorQuery: sum(rate(http_request_duration_seconds_count{namespace="podinfo", path!~"healthz|readyz|metrics", status=~"5.."}[{{.window}}]))
      totalQuery: sum(rate(http_request_duration_seconds_count{namespace="podinfo", path!~"healthz|readyz|metrics"}[{{.window}}]))
```

`{{.window}}` is a placeholder. Sloth replaces it with each window the alerts need, so one query gives the SLI over all of them. The spec doesn't set the 30-day window or the four alert conditions either: they're Sloth's defaults, listed in the [`sloth` Helm Chart](/docs/reference/helm_charts/monitoring/sloth/) reference.

The Sloth controller watches every `PrometheusServiceLevel`, and writes a [`PrometheusRule`](https://prometheus-operator.dev/docs/api-reference/api/#monitoring.coreos.com/v1.PrometheusRule) next to each one, in the same namespace. Prometheus loads it like any other rule.

```mermaid
flowchart LR
    psl["PrometheusServiceLevel<br/>podinfo namespace"] -->|"read by"| sloth["Sloth controller"]
    sloth -->|"writes"| rule["PrometheusRule<br/>podinfo namespace"]
    rule -->|"loaded by"| prom["Prometheus"]
    prom -->|"sends firing alerts"| am["Alertmanager"]
```

The `PrometheusRule` holds three kinds of rules:
- **SLI recording rules**: the error ratio over each window, like `slo:sli_error:ratio_rate5m` and `slo:sli_error:ratio_rate1h`.
- **Metadata recording rules**: the objective, the burn rate, and the remaining error budget, like `slo:period_error_budget_remaining:ratio`.
- **Alert rules**: the page and the ticket alerts, each comparing two pairs of SLI recording rules to their thresholds.

Every rule carries the `sloth_service` and `sloth_slo` labels, which identify its SLO. For the full list of rules, see Sloth's [SLI rules](https://sloth.dev/slo-plugins/core/sli_rules_v1/), [metadata rules](https://sloth.dev/slo-plugins/core/metadata_rules_v1/), and [alert rules](https://sloth.dev/slo-plugins/core/alert_rules_v1/) plugins.

Each app ships its `PrometheusServiceLevel` with its own manifests, like podinfo's `podinfo-slo.yaml`. Its SLOs are then deployed, updated, and removed with the app, and adding one needs no change to the `sloth` app. That's why the CRD isn't installed by the `sloth` chart, but by the `crds-sloth` application, which syncs before the apps (see [Sync Waves](/docs/applications/how-the-app-of-apps-works/#sync-waves)). Otherwise, an app's `PrometheusServiceLevel` would fail to apply until the `sloth` app had synced.

Every SLO labels its alerts `component: slo`, whatever app it covers. An SLO alert reports a symptom users notice, not the component that caused it, so SLO alerts have routes of their own (see [Routing by Component, Then Severity](/docs/monitoring/alerting/how-alerting-works/#routing-by-component-then-severity)).

## Podinfo's SLOs
Podinfo's two SLOs, one for availability and one for latency, are an example pattern for a service that answers requests. They're set in [`manifests/podinfo/podinfo-slo.yaml`](https://github.com/ConsciousML/eks-forge-app-of-apps/blob/main/manifests/podinfo/podinfo-slo.yaml), and the [`podinfo` Manifests](/docs/reference/manifests/podinfo/) reference lists the other files. To choose the SLIs of your own app, see [What to Measure Using SLIs](https://sre.google/workbook/implementing-slos/#what-to-measure-using-slis) in the SRE workbook.

## The SLO Dashboards
Grafana's **SLOs** folder holds two community dashboards for Sloth. [High level Sloth SLOs](https://grafana.com/grafana/dashboards/14643-high-level-sloth-slos/) gives an overview of every SLO. [SLO / Detail](https://grafana.com/grafana/dashboards/14348-slo-detail/) shows one SLO at a time, with its SLI, its burn rate, and its remaining error budget.

Both read Sloth's recording rules and their `sloth_service` and `sloth_slo` labels, not the apps' own metrics. A new `PrometheusServiceLevel` then appears in them with no dashboard change. To add a dashboard of your own, see [Add a Grafana Dashboard](/docs/monitoring/add-a-grafana-dashboard/).

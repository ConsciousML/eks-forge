---
sidebar_position: 1
diataxis-tag: tutorial
---

import DocCards from '@site/src/components/DocCards';
import {ChartLine, ScrollText, Network, Gauge, Bell} from 'lucide-react';

# Monitor Your Cluster

In this tutorial, you'll explore the monitoring tools of your `dev` cluster: you'll open a [Grafana](https://grafana.com/oss/) dashboard, query metrics in [Prometheus](https://prometheus.io/), browse logs, look at network flows in [Hubble](https://github.com/cilium/hubble), read a resource recommendation, and follow an alert to Slack.

Before starting, make sure you've performed the [Quickstart](/docs/quickstart) and that the `dev` cluster from [Dev Deployment](/docs/quickstart/deployment/) is still running.

:::warning
Your `dev` cluster keeps costing around $5 per day in `us-east-1` while it runs. Follow [Destroy the Infrastructure](/docs/quickstart/deployment/#destroy-the-infrastructure) when you're done.
:::

<DocCards columns={3} items={[
  {
    icon: <ChartLine size={36} color="var(--ifm-color-primary-dark)" />,
    title: '1. Metrics',
    description: 'Open a Grafana dashboard and run a query in Prometheus',
    link: '/docs/monitoring/get-started/metrics',
  },
  {
    icon: <ScrollText size={36} color="var(--ifm-color-primary-dark)" />,
    title: '2. Logs',
    description: 'Query pod logs and cluster events in Grafana',
    link: '/docs/monitoring/get-started/logs',
  },
  {
    icon: <Network size={36} color="var(--ifm-color-primary-dark)" />,
    title: '3. Network Flows',
    description: 'Look at pod-to-pod traffic in the Hubble UI',
    link: '/docs/monitoring/get-started/network-flows',
  },
  {
    icon: <Gauge size={36} color="var(--ifm-color-primary-dark)" />,
    title: '4. Resource Recommendations',
    description: 'Read the recommended requests and limits of a workload in Goldilocks',
    link: '/docs/monitoring/get-started/resource-recommendations',
  },
  {
    icon: <Bell size={36} color="var(--ifm-color-primary-dark)" />,
    title: '5. Alerts',
    description: 'Follow an alert from firing to its Slack channel, then silence it',
    link: '/docs/monitoring/get-started/alerts',
  },
]} />

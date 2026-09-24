---
sidebar_position: 1
diataxis-tag: tutorial
---

import DocCards from '@site/src/components/DocCards';
import {Settings, CloudUpload, GitPullRequest} from 'lucide-react';

# Deployment

In this guide, you'll fork and set up the [live repository](https://github.com/ConsciousML/terragrunt-template-live-eks), deploy the EKS stack in the [`staging` environment](/docs/iac/#environments), and promote the stack to `prod`.

Before starting, make sure you've performed the [quickstart](/docs/quickstart).

:::warning
This tutorial deploys billable AWS resources. A `staging` or `prod` cluster costs up to $10 per day in `us-east-1`. Each step ends by destroying what it deployed.
:::

<DocCards columns={3} items={[
  {
    icon: <Settings size={36} color="var(--ifm-color-primary-dark)" />,
    title: '1. Live Repository Setup',
    description: 'Fork and configure the live repository',
    link: '/docs/deployment/live-repository-setup',
  },
  {
    icon: <CloudUpload size={36} color="var(--ifm-color-primary-dark)" />,
    title: '2. Deploy to Staging',
    description: 'Apply the EKS stack manually in staging',
    link: '/docs/deployment/deploy-to-staging',
  },
  {
    icon: <GitPullRequest size={36} color="var(--ifm-color-primary-dark)" />,
    title: '3. Promote to Production',
    description: 'Bump the catalog version through a pull request and let CD apply prod',
    link: '/docs/deployment/promote-to-production',
  },
]} />

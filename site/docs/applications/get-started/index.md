---
sidebar_position: 1
diataxis-tag: tutorial
---

import DocCards from '@site/src/components/DocCards';
import {Settings} from 'lucide-react';

# Set Up Your Applications Repository

In this guide, you'll fork the [ArgoCD app of apps repository](https://github.com/ConsciousML/argocd-app-of-apps-template), deploy the EKS stack in the [`dev` environment](/docs/iac/#dev) from your catalog, and ship a change to your cluster through ArgoCD.

Before starting, make sure you've performed the [quickstart](/docs/quickstart) and the [production deployment](/docs/deployment/) tutorials.

<DocCards columns={2} items={[
  {
    icon: <Settings size={36} color="var(--ifm-color-primary-dark)" />,
    title: '1. ArgoCD App of Apps Setup',
    description: 'Fork the app of apps repository and point your catalog at it',
    link: '/docs/applications/get-started/app-of-apps-setup',
  },
]} />

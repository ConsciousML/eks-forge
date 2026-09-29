---
sidebar_position: 1
diataxis-tag: tutorial
---

import DocCards from '@site/src/components/DocCards';
import {Settings, CloudUpload} from 'lucide-react';

# Deploy Your Applications

In this tutorial, you'll fork the [ArgoCD app of apps repository](https://github.com/ConsciousML/argocd-app-of-apps-template), deploy the EKS stack in the [`dev` environment](/docs/iac/#dev) from your catalog, and ship a change to your cluster through ArgoCD.

Before starting, make sure you've performed the [Quickstart](/docs/quickstart).

<DocCards columns={2} items={[
  {
    icon: <Settings size={36} color="var(--ifm-color-primary-dark)" />,
    title: '1. ArgoCD App of Apps Setup',
    description: 'Fork the app of apps repository and point your catalog at it',
    link: '/docs/applications/get-started/app-of-apps-setup',
  },
  {
    icon: <CloudUpload size={36} color="var(--ifm-color-primary-dark)" />,
    title: '2. Deploy an App Change to Dev',
    description: 'Push a change to your fork and watch ArgoCD sync it to your cluster',
    link: '/docs/applications/get-started/deployment',
  },
]} />

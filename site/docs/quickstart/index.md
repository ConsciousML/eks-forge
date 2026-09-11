---
sidebar_position: 1
---

import DocCards from '@site/src/components/DocCards';
import {ClipboardList, Download, Settings, Rocket, CloudUpload} from 'lucide-react';

# Quickstart

In this tutorial, you'll deploy an EKS cluster with the following [features](../overview/index.md#cluster-features) in the `dev` environment.

<DocCards columns={2} items={[
  {
    icon: <ClipboardList size={36} color="var(--ifm-color-primary-dark)" />,
    title: '1. Prerequisites',
    description: 'What you need before starting',
    link: '/docs/quickstart/prerequisites',
  },
  {
    icon: <Download size={36} color="var(--ifm-color-primary-dark)" />,
    title: '2. Installation',
    description: 'Install the tools required to work with EKS Forge',
    link: '/docs/quickstart/installation',
  },
  {
    icon: <Settings size={36} color="var(--ifm-color-primary-dark)" />,
    title: '3. Configuration',
    description: 'Configure your repository to deploy resources to the cloud',
    link: '/docs/quickstart/configuration',
  },
  {
    icon: <Rocket size={36} color="var(--ifm-color-primary-dark)" />,
    title: '4. Bootstrap',
    description: 'Create the account-wide resources once using automated pipelines',
    link: '/docs/quickstart/bootstrap',
  },
  {
    icon: <CloudUpload size={36} color="var(--ifm-color-primary-dark)" />,
    title: '5. Deploy',
    description: 'Deploy a production-ready EKS platform',
    link: '/docs/quickstart/deploy',
  },
]} />

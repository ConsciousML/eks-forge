---
sidebar_position: 1
---

import DocCards from '@site/src/components/DocCards';
import {ClipboardList, Download, Rocket, CloudUpload} from 'lucide-react';

# Quickstart

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
    icon: <Rocket size={36} color="var(--ifm-color-primary-dark)" />,
    title: '3. Bootstrap',
    description: 'Create the account-wide resources once using automated pipelines',
    link: '/docs/quickstart/bootstrap',
  },
  {
    icon: <CloudUpload size={36} color="var(--ifm-color-primary-dark)" />,
    title: '4. Deploy',
    description: 'Deploy a production-ready EKS platform',
    link: '/docs/quickstart/deploy',
  },
]} />

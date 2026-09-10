---
sidebar_position: 1
---

import DocCards from '@site/src/components/DocCards';
import {ClipboardList, Download, Rocket, Send} from 'lucide-react';

# Quickstart

<DocCards columns={2} items={[
  {
    icon: <ClipboardList size={36} color="var(--ifm-color-primary-dark)" />,
    title: 'Prerequisites',
    description: 'What you need before deploying EKS Forge',
    link: '/docs/quickstart/prerequisites',
  },
  {
    icon: <Download size={36} color="var(--ifm-color-primary-dark)" />,
    title: 'Installation',
    description: 'Install the tools required to work with EKS Forge',
    link: '/docs/quickstart/installation',
  },
  {
    icon: <Rocket size={36} color="var(--ifm-color-primary-dark)" />,
    title: 'Bootstrap',
    description: 'Bootstrap the base infrastructure for your account',
    link: '/docs/quickstart/bootstrap',
  },
  {
    icon: <Send size={36} color="var(--ifm-color-primary-dark)" />,
    title: 'Deploy',
    description: 'Deploy a production-ready EKS platform',
    link: '/docs/quickstart/deploy',
  },
]} />

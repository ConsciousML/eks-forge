import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import {
  BookOpen,
  Rocket,
  Layers,
  Blocks,
  Package,
  Workflow,
  Eye,
  Activity,
  Bell,
  Shield,
} from 'lucide-react';
import styles from './styles.module.css';

const Groups = [
  {
    title: 'Get Started',
    stages: [
      {
        icon: <BookOpen size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Overview',
        description: 'What EKS Forge is and why use it',
        link: '/docs/overview',
      },
      {
        icon: <Layers size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Concepts',
        description: 'Understand EKS Forge in 5 min',
        link: '/docs/concepts',
      },
      {
        icon: <Rocket size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Quickstart',
        description: 'Get a cluster running',
        link: '/docs/quickstart',
      },
    ],
  },
  {
    title: 'Build & Deploy',
    stages: [
      {
        icon: <Blocks size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Infrastructure as Code',
        description: 'Provision infra with Terraform and Terragrunt',
        link: '/docs/iac',
      },
      {
        icon: <Package size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Applications',
        description: 'Deploy workloads with ArgoCD',
        link: '/docs/applications',
      },
      {
        icon: <Workflow size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'CI/CD',
        description: 'Automate build and release pipelines',
        link: '/docs/ci-cd',
      },
    ],
  },
  {
    title: 'Operate',
    stages: [
      {
        icon: <Eye size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Observability',
        description: 'See what is running in your cluster',
        link: '/docs/observability',
      },
      {
        icon: <Activity size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Monitoring',
        description: 'Track cluster and workload health',
        link: '/docs/monitoring',
      },
      {
        icon: <Bell size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Alerting',
        description: 'Get notified before things break',
        link: '/docs/alerting',
      },
      {
        icon: <Shield size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Security',
        description: 'Protect your cluster',
        link: '/docs/security',
      },
    ],
  },
];

function Stage({icon, title, description, link}) {
  return (
    <Link to={link} className={styles.card}>
      <span className={styles.icon}>{icon}</span>
      <Heading as="h3" className={styles.cardTitle}>
        {title}
      </Heading>
      <p className={styles.cardDescription}>{description}</p>
    </Link>
  );
}

function Group({title, stages}) {
  return (
    <div className={styles.group}>
      <Heading as="h3" className={styles.groupTitle}>
        {title}
      </Heading>
      <div className={styles.grid}>
        {stages.map((props, idx) => (
          <Stage key={idx} {...props} />
        ))}
      </div>
    </div>
  );
}

export default function HomepageLifecycle() {
  return (
    <section className={styles.lifecycle}>
      <div className="container">
        {Groups.map((group, idx) => (
          <Group key={idx} {...group} />
        ))}
      </div>
    </section>
  );
}

import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const StageList = [
  {
    icon: '🧭',
    title: 'Concepts',
    description: 'Understand EKS Forge in 5 min',
    link: '/docs/concepts',
  },
  {
    icon: '🚀',
    title: 'Quickstart',
    description: 'Get a cluster running',
    link: '/docs/quickstart',
  },
  {
    icon: '🏗️',
    title: 'Infrastructure as Code',
    description: 'Provision infra with Terraform and Terragrunt',
    link: '/docs/iac',
  },
  {
    icon: '📦',
    title: 'Applications',
    description: 'Deploy workloads with ArgoCD',
    link: '/docs/applications',
  },
  {
    icon: '🔄',
    title: 'CI/CD',
    description: 'Automate build and release pipelines',
    link: '/docs/ci-cd',
  },
  {
    icon: '👁️',
    title: 'Observability',
    description: 'See what is running in your cluster',
    link: '/docs/observability',
  },
  {
    icon: '📊',
    title: 'Monitoring',
    description: 'Track cluster and workload health',
    link: '/docs/monitoring',
  },
  {
    icon: '🔔',
    title: 'Alerting',
    description: 'Get notified before things break',
    link: '/docs/alerting',
  },
  {
    icon: '🔒',
    title: 'Security',
    description: 'Lock down your cluster',
    link: '/docs/security',
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

export default function HomepageLifecycle() {
  return (
    <section className={styles.lifecycle}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Explore EKS Forge
        </Heading>
        <div className={styles.grid}>
          {StageList.map((props, idx) => (
            <Stage key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

import DocCards from '@site/src/components/DocCards';
import {
  BookOpen,
  Rocket,
  CloudUpload,
  Layers,
  Bot,
  Blocks,
  Package,
  Workflow,
  Cpu,
  Eye,
  Activity,
  Bell,
  Shield,
} from 'lucide-react';
import styles from './styles.module.css';

const Groups = [
  {
    title: 'New to EKS Forge? Start here.',
    stages: [
      {
        icon: <BookOpen size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Overview',
        description: 'Understand what EKS Forge is, why use it, and its features',
        link: '/docs/overview',
      },
      {
        icon: <Rocket size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Quickstart',
        description: <>Deploy your first fully-featured cluster in the <code>dev</code> environment</>,
        link: '/docs/quickstart',
      },
      {
        icon: <CloudUpload size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Deployment',
        description: <>Deploy the EKS stack to <code>staging</code> and promote it to <code>prod</code></>,
        link: '/docs/deployment',
      },
      {
        icon: <Layers size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Architecture',
        description: 'Understand the underlying concepts to work with EKS Forge in under 5 min',
        link: '/docs/architecture',
      },
      {
        icon: <Bot size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'AI and EKS Forge',
        description: 'Use AI agents to build, deploy, and operate on EKS Forge',
        link: '/docs/ai-eks-forge',
      },
    ],
  },
  {
    title: 'Build & Deploy',
    stages: [
      {
        icon: <Workflow size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'CI/CD',
        description: <>Automate code quality and security checks on every PR, infrastructure testing in <code>staging</code>, and deployment to <code>prod</code> on merge with approval gates</>,
        link: '/docs/ci-cd',
      },
      {
        icon: <Blocks size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Infrastructure as Code',
        description: <>Create reusable modules and provision them across multiple environments (<code>dev</code>, <code>staging</code>, and <code>prod</code>)</>,
        link: '/docs/iac',
      },
      {
        icon: <Package size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Applications',
        description: 'Deploy Kubernetes manifests and Helm charts with GitOps using ArgoCD and the App of Apps pattern',
        link: '/docs/applications',
      },
    ],
  },
  {
    title: 'Operate',
    stages: [
      {
        icon: <Shield size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Security',
        description: 'Harden the security of your cluster with Network Policies, Pod Security Standards, and more',
        link: '/docs/security',
      },
      {
        icon: <Cpu size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Compute',
        description: 'Size, scale, and optimize your nodes and pods',
        link: '/docs/compute',
      },
      {
        icon: <Eye size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Observability',
        description: 'Visualize dashboards for node, pod, and addon metrics, as well as pod-to-pod network traffic',
        link: '/docs/observability',
      },
      {
        icon: <Activity size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Monitoring',
        description: 'Collect and aggregate the metrics and logs produced by the components running inside your cluster',
        link: '/docs/monitoring',
      },
      {
        icon: <Bell size={36} color="var(--ifm-color-primary-dark)" />,
        title: 'Alerting',
        description: 'Get notified on Slack before things break',
        link: '/docs/alerting',
      },
    ],
  },
];

export default function HomepageLifecycle() {
  return (
    <section className={styles.lifecycle}>
      <div className="container">
        {Groups.map((group, idx) => (
          <DocCards key={idx} title={group.title} items={group.stages} />
        ))}
      </div>
    </section>
  );
}

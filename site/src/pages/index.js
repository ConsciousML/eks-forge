import {useEffect} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useColorMode} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageLifecycle from '@site/src/components/HomepageLifecycle';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function ForceDarkMode() {
  const {colorMode, setColorMode} = useColorMode();
  useEffect(() => {
    const previousMode = colorMode;
    setColorMode('dark');
    document.body.classList.add('homepage-dark');
    return () => {
      setColorMode(previousMode);
      document.body.classList.remove('homepage-dark');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/overview">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <ForceDarkMode />
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageLifecycle />
      </main>
    </Layout>
  );
}

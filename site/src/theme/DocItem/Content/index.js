import Content from '@theme-original/DocItem/Content';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {Clock} from 'lucide-react';
import styles from './styles.module.css';

// Shows the estimated time above the page: `reading-time` is computed in docusaurus.config.js,
// `wait-time` is optional front matter for known waiting (minutes)
export default function ContentWrapper(props) {
  const {frontMatter} = useDoc();
  const readingTime = frontMatter['reading-time'];
  const waitTime = frontMatter['wait-time'];

  return (
    <>
      {readingTime && (
        <p className={styles.estimatedTime}>
          <Clock size={16} />
          {waitTime
            ? `${readingTime + waitTime} min (${readingTime} min read + ${waitTime} min wait)`
            : `${readingTime} min read`}
        </p>
      )}
      <Content {...props} />
    </>
  );
}

import DocBreadcrumbs from '@theme-original/DocBreadcrumbs';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {Clock} from 'lucide-react';
import styles from './styles.module.css';

// Shows the estimated time on the breadcrumbs row: `reading-time` is computed in docusaurus.config.js,
// `wait-time` is optional front matter for known waiting (minutes).
// useDoc only works on doc pages: a category `generated-index` page also renders breadcrumbs and would throw
export default function DocBreadcrumbsWrapper(props) {
  const {frontMatter} = useDoc();
  const readingTime = frontMatter['reading-time'];
  const waitTime = frontMatter['wait-time'];

  return (
    <div className={styles.row}>
      <DocBreadcrumbs {...props} />
      {readingTime && (
        <span className={styles.estimatedTime}>
          <Clock size={16} />
          {waitTime
            ? `${readingTime + waitTime} min (${readingTime} min read + ${waitTime} min wait)`
            : `${readingTime} min read`}
        </span>
      )}
    </div>
  );
}

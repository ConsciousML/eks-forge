import DocBreadcrumbs from '@theme-original/DocBreadcrumbs';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {Clock, Hourglass, Wrench} from 'lucide-react';
import styles from './styles.module.css';

// Shows the estimated time on the breadcrumbs row: `reading-time` is computed in docusaurus.config.js,
// `hands-on-time` and `wait-time` are optional front matter (minutes). Hands-on replaces the reading time,
// since following a tutorial includes reading it.
// useDoc only works on doc pages: a category `generated-index` page also renders breadcrumbs and would throw
export default function DocBreadcrumbsWrapper(props) {
  const {frontMatter} = useDoc();
  const readingTime = frontMatter['reading-time'];
  const handsOnTime = frontMatter['hands-on-time'];
  const waitTime = frontMatter['wait-time'];

  return (
    <div className={styles.row}>
      <DocBreadcrumbs {...props} />
      {readingTime && (
        <div className={styles.times}>
          <span className={styles.time}>
            {handsOnTime ? <Wrench size={16} /> : <Clock size={16} />}
            {handsOnTime ? `${handsOnTime} min hands-on` : `${readingTime} min read`}
          </span>
          {waitTime && (
            <span className={styles.time}>
              <Hourglass size={16} />
              {`${waitTime} min wait`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

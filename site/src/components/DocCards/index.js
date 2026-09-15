import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

function Card({icon, title, description, link}) {
  return (
    <Link to={link} className={styles.card}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <Heading as="h3" className={styles.cardTitle}>
        {title}
      </Heading>
      <p className={styles.cardDescription}>{description}</p>
    </Link>
  );
}

export default function DocCards({title, items, columns = 3}) {
  const grid = (
    <div
      className={styles.grid}
      style={{'--doc-cards-columns': columns}}>
      {items.map((props, idx) => (
        <Card key={idx} {...props} />
      ))}
    </div>
  );

  if (!title) {
    return grid;
  }

  return (
    <div className={styles.group}>
      <Heading as="h3" className={styles.groupTitle}>
        {title}
      </Heading>
      {grid}
    </div>
  );
}

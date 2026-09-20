import ProjectCard from "./ProjectCard";
import SectionMessage from "./SectionMessage";
import styles from "./Home.module.css";

function FeaturedBody({ result, locale, labels }) {
  if (result.failed) return <SectionMessage tone="error">{labels.loadError}</SectionMessage>;
  if (result.data.length === 0) return <SectionMessage>{labels.emptyFeatured}</SectionMessage>;

  return (
    <ul className={styles.cardGrid}>
      {result.data.map((project) => (
        <li key={project.id}>
          <ProjectCard project={project} locale={locale} />
        </li>
      ))}
    </ul>
  );
}

export default function FeaturedProjects({ result, locale, labels }) {
  return (
    <section aria-labelledby="home-featured">
      <h2 id="home-featured" className={styles.sectionTitle}>{labels.featuredTitle}</h2>
      <FeaturedBody result={result} locale={locale} labels={labels} />
    </section>
  );
}

import cn from "classnames";
import styles from "./markdown.module.css";
import Image from "next/image";
import Link from "next/link";

/** Article shape – compatible with NewsArticle type for DB migration */
type ArticleProps = {
  article: {
    id: string;
    contentHtml: string;
    image: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
  };
};

const Markdown = ({ article }: ArticleProps) => {
  const readTime = article.time ? `${article.time} read` : null;

  return (
    <section className={cn("section")}>
      {/* Title block – max-width 800px per Figma */}
      <div className={cn("container", styles.title_container)}>
        <div className={styles.title_wrapper}>
          <h1 className={cn("heading-1", styles.title)}>{article.title}.</h1>

          <div className={styles.article_meta}>
            <span className={cn("label-small", styles.meta_item)}>
              {article.date}
            </span>
            {readTime && (
              <>
                <span className={styles.meta_divider} />
                <span className={cn("label-small", styles.meta_item)}>
                  {readTime}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Full-width hero image – 500px height per Figma */}
      <div className={styles.image_wrapper}>
        <Image
          src={article.image || "/images/ag-legal.jpg"}
          alt={article.title}
          fill
          sizes="100vw"
          className={styles.hero_image}
          priority
        />
      </div>

      {/* Centered article body */}
      <div className={cn("container", styles.content_wrapper)}>
        <article
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          className={styles.article}
        />
      </div>

      {/* CTA section – matches Figma News Details CTA */}
      <div className={cn("section", styles.cta_section)}>
        <div className={cn("container")}>
          <div className={styles.cta_card}>
            <div className={styles.cta_content}>
              <p className={styles.cta_eyebrow}>Ready to take the next step?</p>
              <h2 className={styles.cta_title}>
                Schedule your consultation today.
              </h2>
            </div>
            <Link href="/appointment" className={styles.cta_button}>
              SCHEDULE NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Markdown;

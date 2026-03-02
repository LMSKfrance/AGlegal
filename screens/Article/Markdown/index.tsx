import cn from "classnames";
import styles from "./markdown.module.css";
import Image from "next/image";

type ArticleProps = {
  article: {
    id: string;
    contentHtml: string;
    image: string;
    title: string;
    date: string;
    time: string;
  };
};

const Markdown = ({ article }: ArticleProps) => {
  return (
    <section className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <h1 className={cn("heading-1", styles.title)}>{article.title}.</h1>

          <div className={styles.article_details}>
            <div className={cn("label-small", styles.article_date)}>
              {article.date}
            </div>
            <div className={styles.article_divider} />
            <div className={cn("label-small", styles.article_time)}>
              {article.time}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.image_wrapper}>
        <Image
          src={article.image}
          alt="Picture of the author"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className={cn("container", styles.content)}>
        <div className={styles.thumbnail_wrapper}>
          <div className={styles.thumbnail_image}>
            <Image
              src="/images/ag-legal.jpg"
              alt="AG Legal"
              layout="fill"
              objectFit="cover"
            />
          </div>

          <p className={cn("paragraph-medium", styles.thumbnail_text)}>
            The corporate world thrives on structure and regulations, and
            staying compliant with the latest legal updates is a vital part of
            sustaining business success.
          </p>
        </div>

        <article
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          className={styles.article}
        />
      </div>
    </section>
  );
};

export default Markdown;

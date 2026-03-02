import cn from "classnames";
import styles from "./article.module.css";
import Image from "next/image";

type ArticleProps = {
  article: {
    image?: string;
    title: string;
    date: string;
    time?: string;
    description?: string;
  };
  type?: "side" | "main";
};

const Article = ({ article, type }: ArticleProps) => {
  const fallbackImage = "/images/news/law-changes.jpg";

  if (type === "side") {
    return (
      <div className={styles.side_article}>
        <h6 className={cn("paragraph-medium", styles.side_article_title)}>
          {article.title}
        </h6>
        <p className={cn("label-x-small", styles.side_article_description)}>
          {article.date}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.article}>
      <div className={styles.article_image}>
        <Image
          src={article.image || fallbackImage}
          alt="AG Legal"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className={styles.article_details}>
        <div className={cn("label-x-small", styles.article_date)}>
          {article.date}
        </div>
        <div className={styles.article_divider} />
        <div className={cn("label-x-small", styles.article_time)}>
          {article.time}
        </div>
      </div>

      <div>
        <h6 className={cn("paragraph-x-large", styles.article_title)}>
          {article.title}
        </h6>
        <p className={cn("paragraph-medium", styles.article_description)}>
          {article.description}
        </p>
      </div>
    </div>
  );
};

export default Article;

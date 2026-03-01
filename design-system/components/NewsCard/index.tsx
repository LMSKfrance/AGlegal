import React from "react";
import cn from "classnames";
import styles from "./news-card.module.css";

export type NewsCardProps = {
  title: string;
  excerpt: string;
  date: string;
  readTime?: string;
  thumbnail?: React.ReactNode;
  className?: string;
};

export const NewsCard = ({
  title,
  excerpt,
  date,
  readTime,
  thumbnail,
  className,
}: NewsCardProps) => {
  return (
    <article className={cn(styles.card, className)}>
      {thumbnail && <div className={styles.thumbnail}>{thumbnail}</div>}

      <div className={styles.meta}>
        <span className={styles["meta-text"]}>{date}</span>
        {readTime && (
          <>
            <span className={styles["meta-divider"]} aria-hidden />
            <span className={styles["meta-text"]}>{readTime}</span>
          </>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>
      </div>
    </article>
  );
};

export type NewsCardSmallProps = {
  title: string;
  date: string;
  className?: string;
};

export const NewsCardSmall = ({
  title,
  date,
  className,
}: NewsCardSmallProps) => {
  return (
    <article className={cn(styles["card-small"], className)}>
      <h3 className={styles.title}>{title}</h3>
      <time className={styles.date}>{date}</time>
    </article>
  );
};

export default NewsCard;

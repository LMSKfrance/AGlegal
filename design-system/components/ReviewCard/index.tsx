import React from "react";
import cn from "classnames";
import styles from "./review-card.module.css";

const QuoteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path
      d="M9.333 20c0 2.209-1.790 4-4 4s-4-1.791-4-4c0-2.21 1.79-4 4-4 .468 0 .916.08 1.333.228V14c0-4.418 3.582-8 8-8v2.667c-2.946 0-5.333 2.388-5.333 5.333v.657A4 4 0 0 1 9.333 20Zm17.334 0c0 2.209-1.79 4-4 4s-4-1.791-4-4c0-2.21 1.79-4 4-4 .468 0 .916.08 1.333.228V14c0-4.418 3.582-8 8-8v2.667c-2.946 0-5.333 2.388-5.333 5.333v.657A4 4 0 0 1 26.667 20Z"
      fill="currentColor"
    />
  </svg>
);

export type ReviewCardProps = {
  quote: string;
  authorName: string;
  authorCompany?: string;
  authorAvatar?: React.ReactNode;
  className?: string;
};

const ReviewCard = ({
  quote,
  authorName,
  authorCompany,
  authorAvatar,
  className,
}: ReviewCardProps) => {
  return (
    <div className={cn(styles.card, className)}>
      <div className={styles["quote-section"]}>
        <span className={styles["quote-icon"]} aria-hidden>
          <QuoteIcon />
        </span>
        <p className={styles["quote-text"]}>{quote}</p>
      </div>

      <div className={styles.author}>
        {authorAvatar && (
          <div className={styles.avatar} aria-hidden>
            {authorAvatar}
          </div>
        )}
        <div className={styles["author-info"]}>
          <span className={styles["author-name"]}>{authorName}</span>
          {authorCompany && (
            <span className={styles["author-company"]}>{authorCompany}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;

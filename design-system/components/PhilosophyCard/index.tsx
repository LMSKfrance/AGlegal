import React from "react";
import cn from "classnames";
import styles from "./philosophy-card.module.css";

export type PhilosophyCardProps = {
  badge: string;
  title: string;
  description: string;
  className?: string;
};

const PhilosophyCard = ({
  badge,
  title,
  description,
  className,
}: PhilosophyCardProps) => {
  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.inner}>
        <div className={styles.badge}>
          <span className={styles["badge-text"]}>{badge}</span>
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default PhilosophyCard;

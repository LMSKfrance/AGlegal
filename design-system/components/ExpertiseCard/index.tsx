import React from "react";
import cn from "classnames";
import styles from "./expertise-card.module.css";

export type ExpertiseCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
};

const ExpertiseCard = ({
  title,
  description,
  icon,
  className,
}: ExpertiseCardProps) => {
  return (
    <div className={cn(styles.card, className)}>
      <div className={styles["icon-wrapper"]} aria-hidden>
        {icon}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default ExpertiseCard;

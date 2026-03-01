import React from "react";
import cn from "classnames";
import styles from "./feature-card.module.css";

export type FeatureCardDirection = "row" | "column";

export type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  direction?: FeatureCardDirection;
  className?: string;
};

const FeatureCard = ({
  title,
  description,
  icon,
  direction = "row",
  className,
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        styles.card,
        direction === "row" ? styles["card-row"] : styles["card-column"],
        className
      )}
    >
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

export default FeatureCard;

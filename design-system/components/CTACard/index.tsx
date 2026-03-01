import React from "react";
import cn from "classnames";
import styles from "./cta-card.module.css";

export type CTACardDirection = "row" | "column";

export type CTACardProps = {
  title: string;
  eyebrow?: string;
  action: React.ReactNode;
  direction?: CTACardDirection;
  className?: string;
};

const CTACard = ({
  title,
  eyebrow,
  action,
  direction = "row",
  className,
}: CTACardProps) => {
  return (
    <div
      className={cn(
        styles.card,
        direction === "row" ? styles["card-row"] : styles["card-column"],
        className
      )}
    >
      <div className={styles.content}>
        {eyebrow && (
          <div className={styles.eyebrow}>
            <span className={styles["eyebrow-dot"]} aria-hidden />
            <span className={styles["eyebrow-text"]}>{eyebrow}</span>
          </div>
        )}
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.action}>{action}</div>
    </div>
  );
};

export default CTACard;

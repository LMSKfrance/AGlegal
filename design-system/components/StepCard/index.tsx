import React from "react";
import cn from "classnames";
import styles from "./step-card.module.css";

export type StepCardDirection = "row" | "column";

export type StepCardProps = {
  step: number;
  title: string;
  description: string;
  image?: React.ReactNode;
  direction?: StepCardDirection;
  className?: string;
};

const StepCard = ({
  step,
  title,
  description,
  image,
  direction = "column",
  className,
}: StepCardProps) => {
  const stepLabel = String(step).padStart(2, "0");

  return (
    <div
      className={cn(
        direction === "row" ? styles["card-row"] : styles["card-column"],
        className
      )}
    >
      {image && <div className={styles.visual}>{image}</div>}

      <div className={styles.content}>
        <div className={styles.meta}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <span className={styles["step-number"]} aria-hidden>
          {stepLabel}
        </span>
      </div>
    </div>
  );
};

export default StepCard;

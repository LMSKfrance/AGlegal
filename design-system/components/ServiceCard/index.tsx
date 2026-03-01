import React from "react";
import cn from "classnames";
import styles from "./service-card.module.css";

export type ServiceCardDirection = "row" | "column";

export type ServiceCardProps = {
  title: string;
  description: string;
  category?: string;
  image?: React.ReactNode;
  footer?: React.ReactNode;
  direction?: ServiceCardDirection;
  className?: string;
};

const ServiceCard = ({
  title,
  description,
  category,
  image,
  footer,
  direction = "column",
  className,
}: ServiceCardProps) => {
  return (
    <div
      className={cn(
        styles.card,
        direction === "row" ? styles["card-row"] : styles["card-column"],
        className
      )}
    >
      {image && <div className={styles["image-wrapper"]}>{image}</div>}

      <div className={styles.content}>
        <div className={styles.meta}>
          {category && <span className={styles.category}>{category}</span>}
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default ServiceCard;

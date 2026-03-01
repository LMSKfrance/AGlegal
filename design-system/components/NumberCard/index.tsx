import React from "react";
import cn from "classnames";
import styles from "./number-card.module.css";

export type NumberCardProps = {
  value: string;
  label: string;
  className?: string;
};

const NumberCard = ({ value, label, className }: NumberCardProps) => {
  return (
    <div className={cn(styles.card, className)}>
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </div>
  );
};

export default NumberCard;

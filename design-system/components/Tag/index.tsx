import React from "react";
import cn from "classnames";
import styles from "./tag.module.css";

export type TagProps = {
  label: string;
  className?: string;
};

const Tag = ({ label, className }: TagProps) => {
  return (
    <span className={cn(styles.tag, className)}>
      <span className={styles.dot} aria-hidden />
      <span className={styles.label}>{label}</span>
    </span>
  );
};

export default Tag;

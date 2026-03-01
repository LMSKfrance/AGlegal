"use client";

import React from "react";
import cn from "classnames";
import styles from "./filter-tag.module.css";

export type FilterTagProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

const FilterTag = ({
  label,
  active = false,
  onClick,
  className,
}: FilterTagProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        styles.tag,
        active ? styles.active : styles.inactive,
        className
      )}
    >
      {label}
    </button>
  );
};

export default FilterTag;

import React from "react";
import cn from "classnames";
import styles from "./tab.module.css";

export type TabProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
};

const Tab = ({ label, active = false, onClick, icon, className }: TabProps) => {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(styles.tab, active ? styles.active : styles.inactive, className)}
    >
      {icon && <span aria-hidden>{icon}</span>}
      {label}
    </button>
  );
};

export default Tab;

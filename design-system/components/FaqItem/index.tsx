"use client";

import React, { useState } from "react";
import cn from "classnames";
import styles from "./faq-item.module.css";

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 4V16M4 10H16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export type FaqItemProps = {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
};

const FaqItem = ({
  question,
  answer,
  defaultOpen = false,
  className,
}: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn(styles.item, className)}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className={styles.question}>{question}</span>
        <span className={cn(styles.icon, { [styles["icon-open"]]: isOpen })} aria-hidden>
          <PlusIcon />
        </span>
      </button>

      <div
        className={cn(styles.answer, { [styles["answer-open"]]: isOpen })}
        aria-hidden={!isOpen}
      >
        <div className={styles["answer-inner"]}>
          <p className={styles["answer-text"]}>{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FaqItem;

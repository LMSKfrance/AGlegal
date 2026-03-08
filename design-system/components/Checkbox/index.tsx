"use client";

import React, { useId, useState } from "react";
import cn from "classnames";
import styles from "./checkbox.module.css";

export type CheckboxSize = "l" | "m" | "s" | "xs";

const CheckIcon = ({ size }: { size: CheckboxSize }) => {
  const dim = { l: 12, m: 11, s: 10, xs: 9 }[size];
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 12 12"
      fill="none"
      className={styles["check-icon"]}
    >
      <path
        d="M2 6L4.5 8.5L10 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* ─── Checkbox ───────────────────────────────────────────────── */
export type CheckboxProps = {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: CheckboxSize;
  disabled?: boolean;
  error?: boolean;
  name?: string;
  value?: string;
  id?: string;
  className?: string;
};

export const Checkbox = ({
  label,
  checked,
  defaultChecked = false,
  onChange,
  size = "m",
  disabled = false,
  error = false,
  name,
  value,
  id,
  className,
}: CheckboxProps) => {
  const uid = useId();
  const inputId = id ?? uid;
  const [internal, setInternal] = useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : internal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (checked === undefined) setInternal(e.target.checked);
    onChange?.(e.target.checked);
  };

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "ds-checkbox",
        styles.wrapper,
        styles.checkbox,
        styles[`size-${size}`],
        isChecked && styles.checked,
        disabled && styles.disabled,
        error && styles.error,
        className
      )}
    >
      <input
        type="checkbox"
        id={inputId}
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.input}
      />
      <span className={styles.control}>
        <CheckIcon size={size} />
      </span>
      {label && <span className={styles["label-text"]}>{label}</span>}
    </label>
  );
};

/* ─── Radio ──────────────────────────────────────────────────── */
export type RadioProps = {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: string) => void;
  size?: CheckboxSize;
  disabled?: boolean;
  error?: boolean;
  name?: string;
  value: string;
  id?: string;
  className?: string;
};

export const Radio = ({
  label,
  checked,
  defaultChecked = false,
  onChange,
  size = "m",
  disabled = false,
  error = false,
  name,
  value,
  id,
  className,
}: RadioProps) => {
  const uid = useId();
  const inputId = id ?? uid;
  const [internal, setInternal] = useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : internal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (checked === undefined) setInternal(e.target.checked);
    onChange?.(value);
  };

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "ds-radio",
        styles.wrapper,
        styles.radio,
        styles[`size-${size}`],
        isChecked && styles.checked,
        disabled && styles.disabled,
        error && styles.error,
        className
      )}
    >
      <input
        type="radio"
        id={inputId}
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.input}
      />
      <span className={styles.control}>
        <span className={styles["radio-dot"]} />
      </span>
      {label && <span className={styles["label-text"]}>{label}</span>}
    </label>
  );
};

export default Checkbox;

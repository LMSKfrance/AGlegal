"use client";

import React, { useId, useState } from "react";
import cn from "classnames";
import styles from "./toggle.module.css";

export type ToggleSize = "l" | "m" | "s" | "xs";

export type ToggleProps = {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: ToggleSize;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
};

const Toggle = ({
  label,
  checked,
  defaultChecked = false,
  onChange,
  size = "m",
  disabled = false,
  name,
  id,
  className,
}: ToggleProps) => {
  const uid = useId();
  const inputId = id ?? uid;

  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isOn = checked !== undefined ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (checked === undefined) setInternalChecked(e.target.checked);
    onChange?.(e.target.checked);
  };

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "ds-toggle",
        styles.wrapper,
        styles[`size-${size}`],
        isOn && styles.on,
        disabled && styles.disabled,
        className
      )}
    >
      <input
        type="checkbox"
        role="switch"
        id={inputId}
        name={name}
        checked={isOn}
        onChange={handleChange}
        disabled={disabled}
        aria-checked={isOn}
        className={styles.input}
      />

      <span className={cn(styles.row, isOn && styles.on, disabled && styles.disabled)}>
        <span className={styles.track}>
          <span className={styles.thumb} />
        </span>

        {label && <span className={styles["label-text"]}>{label}</span>}
      </span>
    </label>
  );
};

export default Toggle;

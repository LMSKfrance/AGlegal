"use client";

import React from "react";
import cn from "classnames";
import styles from "./text-field.module.css";

export type TextFieldVariant = "primary" | "secondary";
export type TextFieldSize = "l" | "m" | "s";
export type TextFieldState = "default" | "error" | "disabled";

export type TextFieldProps = {
  label?: string;
  placeholder?: string;
  hint?: string;
  variant?: TextFieldVariant;
  size?: TextFieldSize;
  state?: TextFieldState;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute;
  name?: string;
  id?: string;
  className?: string;
  required?: boolean;
  autoComplete?: string;
};

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      placeholder,
      hint,
      variant = "primary",
      size = "m",
      state = "default",
      leftIcon,
      rightIcon,
      value,
      defaultValue,
      onChange,
      onBlur,
      type = "text",
      name,
      id,
      className,
      required,
      autoComplete,
    },
    ref
  ) => {
    const isDisabled = state === "disabled";
    const isError = state === "error";
    const inputId = id ?? name;

    return (
      <div
        className={cn(
          "ds-textfield",
          styles.wrapper,
          styles[`size-${size}`],
          variant === "secondary" && styles.secondary,
          isError && styles["state-error"],
          className
        )}
      >
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && <span aria-hidden> *</span>}
          </label>
        )}

        <div
          className={cn(
            styles["input-wrapper"],
            leftIcon ? styles["has-left-icon"] : undefined,
            rightIcon ? styles["has-right-icon"] : undefined
          )}
        >
          {leftIcon && (
            <span className={styles["icon-left"]} aria-hidden>
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={isDisabled}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            autoComplete={autoComplete}
            aria-invalid={isError}
            aria-describedby={hint ? `${inputId}-hint` : undefined}
            className={styles.input}
          />

          {rightIcon && (
            <span className={styles["icon-right"]} aria-hidden>
              {rightIcon}
            </span>
          )}
        </div>

        {hint && (
          <p
            id={`${inputId}-hint`}
            className={cn(styles.hint, isError && styles["hint-error"])}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
export default TextField;

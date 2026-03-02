"use client";

import React from "react";
import cn from "classnames";
import styles from "./text-area.module.css";

export type TextAreaVariant = "primary" | "secondary";
export type TextAreaSize = "l" | "m" | "s";
export type TextAreaState = "default" | "error" | "disabled";

export type TextAreaProps = {
  label?: string;
  placeholder?: string;
  hint?: string;
  variant?: TextAreaVariant;
  size?: TextAreaSize;
  state?: TextAreaState;
  rows?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  name?: string;
  id?: string;
  className?: string;
  required?: boolean;
};

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      placeholder,
      hint,
      variant = "primary",
      size = "m",
      state = "default",
      rows = 4,
      value,
      defaultValue,
      onChange,
      onBlur,
      name,
      id,
      className,
      required,
    },
    ref
  ) => {
    const isDisabled = state === "disabled";
    const isError = state === "error";
    const textareaId = id ?? name;

    return (
      <div
        className={cn(
          "ds-textarea",
          styles.wrapper,
          styles[`size-${size}`],
          variant === "secondary" && styles.secondary,
          isError && styles["state-error"],
          className
        )}
      >
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
            {required && <span aria-hidden> *</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          placeholder={placeholder}
          disabled={isDisabled}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          aria-invalid={isError}
          aria-describedby={hint ? `${textareaId}-hint` : undefined}
          className={styles.textarea}
        />

        {hint && (
          <p
            id={`${textareaId}-hint`}
            className={cn(styles.hint, isError && styles["hint-error"])}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
export default TextArea;

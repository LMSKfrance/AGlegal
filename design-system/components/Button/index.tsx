"use client";

import React from "react";
import cn from "classnames";
import styles from "./button.module.css";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonStyle = "dark" | "light";
export type ButtonSize = "m" | "s" | "xs";

export type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  /** "dark" and "light" only apply to primary variant */
  colorStyle?: ButtonStyle;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  /** Render as <a> element */
  href?: string;
};

const variantClass: Record<string, string> = {
  "primary-dark": styles["primary-dark"],
  "primary-light": styles["primary-light"],
  secondary: styles.secondary,
  outline: styles.outline,
  ghost: styles.ghost,
};

const sizeClass: Record<ButtonSize, string> = {
  m: styles["size-m"],
  s: styles["size-s"],
  xs: styles["size-xs"],
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      colorStyle = "dark",
      size = "m",
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      type = "button",
      onClick,
      className,
      href,
    },
    ref
  ) => {
    const variantKey =
      variant === "primary" ? `primary-${colorStyle}` : variant;

    const classes = cn(
      "ds-btn",
      styles.btn,
      variantClass[variantKey],
      sizeClass[size],
      { [styles["full-width"]]: fullWidth },
      className
    );

    if (href) {
      return (
        <a href={href} className={classes} aria-disabled={disabled}>
          {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        onClick={onClick}
      >
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        {children}
        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;

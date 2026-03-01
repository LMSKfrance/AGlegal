"use client";

import React, { useRef, useState, useEffect, useId } from "react";
import cn from "classnames";
import styles from "./dropdown.module.css";

export type DropdownOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

export type DropdownDirection = "bottom" | "top";

export type DropdownProps = {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  direction?: DropdownDirection;
  prefixIcon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  name?: string;
};

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2 7L5.5 10.5L12 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Dropdown = ({
  label,
  placeholder = "Select an option",
  options,
  value,
  defaultValue,
  onChange,
  direction = "bottom",
  prefixIcon,
  disabled = false,
  className,
  name,
}: DropdownProps) => {
  const uid = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(
    value ?? defaultValue
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync controlled value
  useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === selected);

  const handleSelect = (optionValue: string) => {
    if (value === undefined) setSelected(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn(styles.wrapper, className)}
      aria-disabled={disabled}
    >
      {label && (
        <label id={`${uid}-label`} className={styles.label}>
          {label}
        </label>
      )}

      {/* Hidden native select for form submission */}
      {name && (
        <select name={name} value={selected ?? ""} onChange={() => {}} hidden>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      <button
        type="button"
        className={cn(styles.trigger, { [styles.open]: isOpen })}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? `${uid}-label` : undefined}
        disabled={disabled}
      >
        {prefixIcon && (
          <span className={styles["prefix-icon"]} aria-hidden>
            {prefixIcon}
          </span>
        )}

        {selectedOption ? (
          <>
            {selectedOption.icon && (
              <span aria-hidden>{selectedOption.icon}</span>
            )}
            <span>{selectedOption.label}</span>
          </>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}

        <span
          className={cn(styles["trigger-icon"], { [styles.rotated]: isOpen })}
          aria-hidden
        >
          <ChevronIcon />
        </span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={label ?? placeholder}
          className={cn(styles.menu, {
            [styles["menu-top"]]: direction === "top",
          })}
        >
          {options.map((option) => {
            const isSelected = option.value === selected;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={cn(styles.option, {
                    [styles.selected]: isSelected,
                  })}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.icon && <span aria-hidden>{option.icon}</span>}
                  {option.label}
                  {isSelected && (
                    <span className={styles["option-check"]} aria-hidden>
                      <CheckIcon />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;

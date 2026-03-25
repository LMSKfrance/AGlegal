import cn from "classnames";
import styles from "./dropdown.module.css";

type DropdownProps = {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  name?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
};

const Dropdown = ({ label, placeholder, options, name, error, value, onChange, onBlur }: DropdownProps) => {
  return (
    <div className={styles.container}>
      {label && (
        <label className={cn("label-small", styles.label)}>{label}</label>
      )}
      <select
        name={name}
        value={value ?? "1"}
        onChange={onChange}
        onBlur={onBlur}
        className={cn(styles.select, { [styles.select_error]: !!error })}
        aria-label={label}
      >
        <option
          value="1"
          disabled
          hidden
          className={cn("label-small", styles.option)}
        >
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.error_message}>{error}</span>}
    </div>
  );
};

export default Dropdown;

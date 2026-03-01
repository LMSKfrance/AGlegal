import cn from "classnames";
import styles from "./dropdown.module.css";

type DropdownProps = {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
};

const Dropdown = ({ label, placeholder, options }: DropdownProps) => {
  return (
    <div className={styles.container}>
      {label && (
        <label className={cn("label-small", styles.label)}>{label}</label>
      )}

      <select className={styles.select} defaultValue="1" aria-label={label}>
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
    </div>
  );
};

export default Dropdown;

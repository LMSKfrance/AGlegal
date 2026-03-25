import cn from "classnames";
import styles from "./text-field.module.css";

type TextFieldProps = {
  label?: string;
  placeholder: string;
  className?: string;
  size?: "medium" | "large";
  name?: string;
  type?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const TextField = ({ label, placeholder, className, size, name, type, error, value, onChange, onBlur }: TextFieldProps) => {
  if (size === "medium") {
    return (
      <div className={styles.container}>
        {label && (
          <label className={cn("label-small", styles.label)}>{label}</label>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={cn("label-small", styles.input, className, {
            [styles.medium]: size === "medium",
            [styles.input_error]: !!error,
          })}
          placeholder={placeholder}
        />
        {error && <span className={styles.error_message}>{error}</span>}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {label && (
        <label className={cn("label-medium", styles.label)}>{label}</label>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={cn("label-medium", styles.input, className, {
          [styles.input_error]: !!error,
        })}
        placeholder={placeholder}
      />
      {error && <span className={styles.error_message}>{error}</span>}
    </div>
  );
};

export default TextField;

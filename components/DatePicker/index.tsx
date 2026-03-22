import cn from "classnames";
import styles from "./date-picker.module.css";

type DatePickerProps = {
  label: string;
  placeholder: string;
  name?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const DatePicker = ({ label, placeholder, name, error, value, onChange, onBlur }: DatePickerProps) => {
  return (
    <div className={styles.container}>
      {label && (
        <label className={cn("label-small", styles.label)}>{label}</label>
      )}
      <input
        type="date"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn(styles.date_picker, { [styles.date_picker_error]: !!error })}
      />
      {error && <span className={styles.error_message}>{error}</span>}
    </div>
  );
};

export default DatePicker;

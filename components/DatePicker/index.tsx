import cn from "classnames";
import styles from "./date-picker.module.css";

type DatePickerProps = {
  label: string;
  placeholder: string;
  name?: string;
};

const DatePicker = ({ label, placeholder, name }: DatePickerProps) => {
  return (
    <div className={styles.container}>
      {label && (
        <label className={cn("label-small", styles.label)}>{label}</label>
      )}

      <input
        type="date"
        name={name}
        placeholder={placeholder}
        defaultValue=""
        className={styles.date_picker}
      />
    </div>
  );
};

export default DatePicker;

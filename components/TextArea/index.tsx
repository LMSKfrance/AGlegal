import cn from "classnames";
import styles from "./text-area.module.css";

type TextAreaProps = {
  label?: string;
  placeholder: string;
  name?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
};

const TextArea = ({ label, placeholder, name, error, value, onChange, onBlur }: TextAreaProps) => {
  return (
    <div className={styles.container}>
      {label && (
        <label className={cn("label-small", styles.label)}>{label}</label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={cn("label-small", styles.textarea, {
          [styles.textarea_error]: !!error,
        })}
        placeholder={placeholder}
      />
      {error && <span className={styles.error_message}>{error}</span>}
    </div>
  );
};

export default TextArea;

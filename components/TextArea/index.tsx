import cn from "classnames";
import styles from "./text-area.module.css";

type TextAreaProps = {
  label?: string;
  placeholder: string;
  name?: string;
};

const TextArea = ({ label, placeholder, name }: TextAreaProps) => {
  return (
    <div className={styles.container}>
      {label && (
        <label className={cn("label-small", styles.label)}>{label}</label>
      )}

      <textarea
        name={name}
        className={cn("label-small", styles.textarea)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextArea;

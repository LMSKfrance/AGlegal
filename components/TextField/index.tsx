import cn from "classnames";
import styles from "./text-field.module.css";

type TextFieldProps = {
  label?: string;
  placeholder: string;
  className?: string;
  size?: "medium" | "large";
};

const TextField = ({ label, placeholder, className, size }: TextFieldProps) => {
  if (size === "medium") {
    return (
      <div className={styles.container}>
        {label && (
          <label className={cn("label-small", styles.label)}>{label}</label>
        )}

        <input
          className={cn("label-small", styles.input, className, {
            [styles.medium]: size === "medium",
          })}
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {label && (
        <label className={cn("label-medium", styles.label)}>{label}</label>
      )}

      <input
        className={cn("label-medium", styles.input, className)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextField;

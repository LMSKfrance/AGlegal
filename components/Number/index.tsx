import cn from "classnames";
import styles from "./number.module.css";

type NumberProps = {
  title: string;
  subtitle: string;
};

const Number = ({ title, subtitle }: NumberProps) => {
  return (
    <div className={styles.number}>
      <h6 className={cn("heading-6", styles.number_title)}>{title}</h6>
      <p className={cn("paragraph-x-large", styles.number_subtitle)}>
        {subtitle}
      </p>
    </div>
  );
};

export default Number;

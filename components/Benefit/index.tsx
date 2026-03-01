import cn from "classnames";
import styles from "./benefit.module.css";

type BenefitProps = {
  benefit: {
    id: number;
    icon: React.ReactNode;
    title: string;
    description: string;
  };
};

const Benefit = ({ benefit }: BenefitProps) => {
  return (
    <div className={styles.benefit}>
      <div className={styles.icon_wrapper}>{benefit.icon}</div>

      <div className={styles.title_wrapper}>
        <div className={cn("paragraph-x-large", styles.title)}>
          {benefit.title}
        </div>
        <p className={cn("paragraph-medium", styles.description)}>
          {benefit.description}
        </p>
      </div>
    </div>
  );
};

export default Benefit;

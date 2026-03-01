import Image from "next/image";
import cn from "classnames";
import styles from "./value.module.css";

type ValueProps = {
  image: string;
  value: string;
  title: string;
  description: string;
};

const Value = ({ image, value, title, description }: ValueProps) => {
  return (
    <figure className={styles.value}>
      <div className={styles.value_image}>
        <Image src={image} alt="Law firm" layout="fill" objectFit="cover" />
      </div>

      <div className={styles.value_overlay}>
        <div className={styles.value_tag}>
          <div className={cn("label-small", styles.value_tag_title)}>
            {value}
          </div>
        </div>

        <div>
          <h6 className={cn("heading-6", styles.value_title)}>{title}</h6>
          <p className={cn("paragraph-medium", styles.value_description)}>
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export default Value;

import Image from "next/image";
import cn from "classnames";
import styles from "./office.module.css";

type OfficeProps = {
  office: {
    title: string;
    image: string;
  };
};

const Office = ({ office }: OfficeProps) => {
  return (
    <div className={styles.office}>
      <div className={styles.office_image}>
        <Image
          src={office.image}
          layout="fill"
          objectFit="cover"
          alt="AG Legal"
        />
      </div>

      <div className={cn("paragraph-medium", styles.office_name)}>
        {office.title}
      </div>
    </div>
  );
};

export default Office;

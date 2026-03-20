"use client";

import Image from "next/image";
import cn from "classnames";
import styles from "./service.module.css";
import icons from "@/constants/icons";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

type ServiceProps = {
  service: {
    id: number;
    image: string;
    title: string;
    description: string;
    slug: string;
    learnMoreUrl?: string;
  };
};

const Service = ({ service }: ServiceProps) => {
  const { t } = useLanguage();

  return (
    <Link href={service.learnMoreUrl ?? `/services/${service.slug}`} className={styles.service}>
      <div className={styles.service_image}>
        {service.image && (
          <Image
            src={service.image}
            layout="fill"
            objectFit="cover"
            alt="service"
          />
        )}
      </div>

      <div className={styles.service_content}>
        <div className={styles.service_title_wrapper}>
          <div className={cn("paragraph-x-large", styles.service_title)}>
            {service.title}
          </div>
          <p className={cn("paragraph-medium", styles.service_description)}>
            {service.description}
          </p>
        </div>

        <button className={cn("label-small", styles.button)}>
          <div className={styles.circle}>{icons.ArrowUpRight}</div>
          {t.ui.service.learnMore}
        </button>
      </div>
    </Link>
  );
};

export default Service;

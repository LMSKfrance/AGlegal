"use client";

import cn from "classnames";
import styles from "./cta.module.css";
import Link from "next/link";
import LogoMini from "@/design-system/components/LogoMini";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CTAContent } from "@/lib/home";

type CTAClientProps = {
  contentEn: CTAContent;
  contentKa: CTAContent;
};

const CTAClient = ({ contentEn, contentKa }: CTAClientProps) => {
  const { locale } = useLanguage();
  const content = locale === "ka" ? contentKa : contentEn;

  return (
    <div className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.cta_wrapper}>
          <div className={styles.content}>
            <div className={styles.text}>
              <div className={styles.eyebrow}>
                <LogoMini static className={styles.logo_icon} />
                <span className={cn("subheading-small", styles.subtitle)}>
                  {content.subtitle}
                </span>
              </div>
              <h2 className={cn("heading-4", styles.title)}>
                {content.title}
                <span className={styles.blue}>.</span>
              </h2>
            </div>

            <Link href={content.buttonUrl} className={cn("button-white")}>
              {content.button}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAClient;

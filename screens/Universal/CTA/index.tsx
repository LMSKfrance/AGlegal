"use client";

import cn from "classnames";
import styles from "./cta.module.css";
import Link from "next/link";
import LogoMini from "@/design-system/components/LogoMini";
import { useHomeContent } from "@/screens/Home/HomeContentContext";

const CTA = () => {
  const { cta } = useHomeContent();
  const { subtitle, title, button, buttonUrl } = cta;

  return (
    <div className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.cta_wrapper}>
          <div className={styles.content}>
            <div className={styles.text}>
              <div className={styles.eyebrow}>
                <LogoMini static className={styles.logo_icon} />
                <span className={cn("subheading-small", styles.subtitle)}>
                  {subtitle}
                </span>
              </div>
              <h2 className={cn("heading-4", styles.title)}>
                {title}
                <span className={styles.blue}>.</span>
              </h2>
            </div>

            <Link href={buttonUrl || "/appointment"} className={cn("button-white")}>
              {button}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;

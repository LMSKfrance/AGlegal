import cn from "classnames";
import styles from "./cta.module.css";
import Link from "next/link";
import LogoMini from "@/design-system/components/LogoMini";

const CTA = () => {
  return (
    <div className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.cta_wrapper}>
          <div className={styles.content}>
            <div className={styles.text}>
              <div className={styles.eyebrow}>
                <LogoMini static className={styles.logo_icon} />
                <span className={cn("subheading-small", styles.subtitle)}>
                  Ready to take the next step?
                </span>
              </div>
              <h2 className={cn("heading-4", styles.title)}>
                Schedule your consultation today.
              </h2>
            </div>

            <Link href="/appointment" className={cn("button-white")}>
              SCHEDULE NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;

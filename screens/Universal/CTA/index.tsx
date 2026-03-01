import cn from "classnames";
import styles from "./cta.module.css";
import Link from "next/link";

const CTA = () => {
  return (
    <div className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.cta_wrapper}>
          <div>
            <div className={cn("subheading-small", styles.subtitle)}>
              Ready to take the next step?
            </div>
            <div className={cn("heading-4", styles.title)}>
              Schedule your consultation today.
            </div>
          </div>

          <Link href="/appointment" className={cn("button-white")}>
            SCHEDULE NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTA;

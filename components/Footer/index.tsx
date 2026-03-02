"use client";

import cn from "classnames";
import styles from "./footer.module.css";
import { LogoMini } from "@/design-system";
import Link from "next/link";
import icons from "@/constants/icons";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const { footer_nav_links, footer_social_links } = t;

  return (
    <footer className={cn("section", styles.footer)}>
      <div className={cn("container", styles.container)}>
        {/* <div className={styles.newsletter_wrapper}>
          <h2 className={styles.newsletter_title}>
            Subscribe to our newsletter
          </h2>
          <div className={styles.input_wrapper}>
            <TextField placeholder="Your email" />
            <button type="button" className={styles.newsletter_button}>
              GET STARTED
            </button>
          </div>
        </div>

        <div className={styles.divider} /> */}

        <div className={styles.footer_wrapper}>
          <LogoMini className={styles.footer_logo} />

          <div className={styles.links_row}>
            <nav className={styles.footer_nav} aria-label="Footer navigation">
              {footer_nav_links.map((link) => (
                <Link key={link.id} href={link.url} className={styles.footer_link}>
                  {link.title}
                </Link>
              ))}
            </nav>
            <div className={styles.footer_socials}>
              {footer_social_links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  rel="noreferrer"
                  target="_blank"
                  className={styles.footer_link}
                >
                  {link.title}
                </a>
              ))}
            </div>
            <button type="button" className={styles.download_button}>
              <span className={styles.download_circle}>
                {icons.DownloadArrow}
              </span>
              <span className={styles.download_text_wrapper}>
                <span className={styles.download_text}>
                  {t.ui.footer.download}
                </span>
                <span className={styles.size_text}>{t.ui.footer.size}</span>
              </span>
            </button>
          </div>
        </div>

        <div className={styles.texts_wrapper}>
          <p className={styles.copyright_text}>
            {t.ui.footer.copyright}
          </p>
          <div className={styles.terms_wrapper}>
            <Link href="/terms" className={styles.terms_text}>
              {t.ui.footer.terms}
            </Link>
            <Link href="/privacy" className={styles.terms_text}>
              {t.ui.footer.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import cn from "classnames";
import styles from "./footer.module.css";
import { LogoMini } from "@/design-system";
import Link from "next/link";
import icons from "@/constants/icons";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type PresentationMeta = { filename: string; sizeLabel: string } | null;

const Footer = () => {
  const { t, locale } = useLanguage();
  const { footer_nav_links, footer_social_links } = t;

  const [presEn, setPresEn] = useState<PresentationMeta>(null);
  const [presKa, setPresKa] = useState<PresentationMeta>(null);

  useEffect(() => {
    fetch("/api/presentation-meta")
      .then((r) => r.json())
      .then((data) => {
        setPresEn(data.en ?? null);
        setPresKa(data.ka ?? null);
      })
      .catch(() => {});
  }, []);

  const currentPres = locale === "ka" ? presKa : presEn;
  const downloadHref = `/api/presentation/${locale}`;

  return (
    <footer className={cn("section", styles.footer)}>
      <div className={cn("container", styles.container)}>
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

            {currentPres && (
              <a
                href={downloadHref}
                download
                className={styles.download_button}
              >
                <span className={styles.download_circle}>
                  {icons.DownloadArrow}
                </span>
                <span className={styles.download_text_wrapper}>
                  <span className={styles.download_text}>
                    {t.ui.footer.download}
                  </span>
                  <span className={styles.size_text}>{currentPres.sizeLabel}</span>
                </span>
              </a>
            )}
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

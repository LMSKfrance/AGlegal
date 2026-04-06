"use client";

import cn from "classnames";
import styles from "./body.module.css";
import { useAboutContent } from "../AboutContentContext";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutBody = () => {
  const { sections } = useAboutContent();
  const { locale } = useLanguage();

  const title = locale === "ka"
    ? sections.bodyTitleKa?.trim() || sections.bodyTitleEn?.trim()
    : sections.bodyTitleEn?.trim();

  const html = locale === "ka"
    ? sections.bodyKa?.trim() || sections.bodyEn?.trim()
    : sections.bodyEn?.trim();

  if (!title && !html) return null;

  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        {title && <h2 className={cn("heading-3", styles.title)}>{title}</h2>}
        {html && (
          <div
            className={cn("paragraph-large", styles.body)}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </section>
  );
};

export default AboutBody;

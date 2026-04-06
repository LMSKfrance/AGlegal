"use client";

import cn from "classnames";
import styles from "./body.module.css";
import { useAboutContent } from "../AboutContentContext";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutBody = () => {
  const { sections } = useAboutContent();
  const { locale } = useLanguage();

  const html = locale === "ka"
    ? sections.bodyKa?.trim() || sections.bodyEn?.trim()
    : sections.bodyEn?.trim();

  if (!html) return null;

  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div
          className={cn("paragraph-large", styles.body)}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
};

export default AboutBody;

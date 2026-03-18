"use client";

import cn from "classnames";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./legal.module.css";

type Props = {
  titleEn: string;
  titleKa: string | null;
  contentEn: string;
  contentKa: string | null;
};

const LegalPage = ({ titleEn, titleKa, contentEn, contentKa }: Props) => {
  const { locale } = useLanguage();
  const title = locale === "ka" && titleKa ? titleKa : titleEn;
  const content = locale === "ka" && contentKa ? contentKa : contentEn;

  return (
    <Layout>
      <section className={cn("section", styles.page)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.header}>
            <nav className={styles.breadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>{title}</span>
            </nav>
            <h1 className={styles.title}>{title}</h1>
          </div>

          <article
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </section>
    </Layout>
  );
};

export default LegalPage;

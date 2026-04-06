"use client";

import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./legal.module.css";

type Props = {
  titleEn: string;
  titleKa: string | null;
  contentEn: string | null;
  contentKa: string | null;
  heroImage?: string | null;
  ctaTextEn?: string | null;
  ctaTextKa?: string | null;
  ctaUrl?: string | null;
  hideBreadcrumb?: boolean;
};

export function LegalPageInner({ titleEn, titleKa, contentEn, contentKa, heroImage, ctaTextEn, ctaTextKa, ctaUrl, hideBreadcrumb }: Props) {
  const { locale } = useLanguage();
  const title = locale === "ka" && titleKa ? titleKa : titleEn;
  const content = locale === "ka" && contentKa ? contentKa : contentEn;
  const ctaText = locale === "ka" && ctaTextKa ? ctaTextKa : (ctaTextEn ?? null);

  return (
    <section className={cn("section", styles.page)}>
      <div className={cn("container", styles.container)}>
        {heroImage && (
          <div className={styles.hero_image_wrap}>
            <Image
              src={heroImage}
              alt={title}
              fill
              sizes="(max-width: 860px) 100vw, 860px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        )}

        {!hideBreadcrumb && (
          <div className={styles.header}>
            <nav className={styles.breadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>{title}</span>
            </nav>
            <h1 className={styles.title}>{title}</h1>
          </div>
        )}

        {hideBreadcrumb && <h1 className={cn(styles.title, styles.title_no_breadcrumb)}>{title}</h1>}

        {content && (
          <article
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {ctaUrl && ctaText && (
          <div className={styles.cta_wrap}>
            <Link href={ctaUrl} className="button">
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

const LegalPage = (props: Props) => (
  <Layout>
    <LegalPageInner {...props} />
  </Layout>
);

export default LegalPage;

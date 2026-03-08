"use client";

import React from "react";
import cn from "classnames";
import styles from "./news-listing.module.css";
import Image from "next/image";
import Link from "next/link";
import { NewsCard, NewsCardSmall } from "@/design-system/components/NewsCard";
import Tag from "@/components/Tag";

export type NewsArticle = {
  id: string;
  image?: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  tags: string[];
  type?: "main" | "side";
};

const NEWS_TAGS = [
  { id: 1, title: "All", slug: null },
  { id: 2, title: "Corporate Law", slug: "corporate-law" },
  { id: 3, title: "Family Law", slug: "family-law" },
  { id: 4, title: "Real Estate", slug: "real-estate" },
  { id: 5, title: "Personal Injury", slug: "personal-injury" },
  { id: 6, title: "Criminal Defense", slug: "criminal-defense" },
  { id: 7, title: "Immigration", slug: "immigration" },
  { id: 8, title: "Legal Trends", slug: "legal-trends" },
  { id: 9, title: "Case Studies", slug: "case-studies" },
  { id: 10, title: "Tips & Guides", slug: "tips-guides" },
];

const NewsListing = ({
  articles,
  initialTag = "All",
}: {
  articles: NewsArticle[];
  initialTag?: string;
}) => {
  const [activeTag, setActiveTag] = React.useState(initialTag);

  React.useEffect(() => {
    setActiveTag(initialTag);
  }, [initialTag]);

  const filtered = React.useMemo(() => {
    if (activeTag === "All") return articles;
    return articles.filter((a) =>
      a.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase())
    );
  }, [articles, activeTag]);

  const featured = filtered.slice(0, 3);
  const secondary = filtered.slice(3, 4);
  const recent = filtered.slice(4, 7);

  const formatReadTime = (t?: string) =>
    t ? (t.includes("read") ? t : `${t} read`) : undefined;

  const formatDateUppercase = (d: string) => {
    const parts = d.replace(",", "").split(" ");
    return parts.length >= 3
      ? `${parts[0].toUpperCase()} ${parts[1]}, ${parts[2]}`
      : d.toUpperCase();
  };

  return (
    <section className={cn("section")}>
      <div className={cn("container", styles.container)}>
        <h1 className={cn("hero-2", styles.title)}>News.</h1>

        {/* Row 1: 3 large cards */}
        <div className={styles.grid_large}>
          {featured.map((article) => (
            <Link key={article.id} href={`/news/${article.id}`}>
              <NewsCard
                title={article.title}
                excerpt={article.description}
                date={article.date}
                readTime={formatReadTime(article.time)}
                thumbnail={
                  <Image
                    src={article.image || "/images/ag-legal.jpg"}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                }
                className={styles.card_link}
              />
            </Link>
          ))}
        </div>

        {/* Row 2: 1 large + 3 small + tags */}
        <div className={styles.grid_secondary}>
          <div className={styles.secondary_main}>
            {secondary[0] && (
              <Link href={`/news/${secondary[0].id}`}>
                <NewsCard
                  title={secondary[0].title}
                  excerpt={secondary[0].description}
                  date={secondary[0].date}
                  readTime={formatReadTime(secondary[0].time)}
                  thumbnail={
                    <Image
                      src={secondary[0].image || "/images/ag-legal.jpg"}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                    />
                  }
                  className={styles.card_link}
                />
              </Link>
            )}
          </div>

          <div className={styles.secondary_side}>
            <div className={styles.recent_header}>Recent news</div>
            {recent.map((article) => (
              <Link key={article.id} href={`/news/${article.id}`}>
                <NewsCardSmall
                  title={article.title}
                  date={formatDateUppercase(article.date)}
                />
              </Link>
            ))}

            <div className={styles.tags_wrapper}>
              {NEWS_TAGS.map((tag) => (
                <Link
                  key={tag.id}
                  href={tag.slug ? `/news/category/${tag.slug}` : "/news"}
                  className={styles.tag_link}
                >
                  <Tag
                    tag={{ id: tag.id, title: tag.title }}
                    activeTag={activeTag}
                    setActiveTag={setActiveTag}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsListing;

"use client";

import React from "react";
import cn from "classnames";
import styles from "./articles.module.css";
import mock from "@/constants/mock";
import Article from "../Article";
import Tag from "../Tag";
import Link from "next/link";

type ArticleProps = {
  articles: {
    id: string;
    title: string;
    date: string;
    tags: string[];
    type?: "main" | "side";
  }[];
};

const Articles = ({ articles }: ArticleProps) => {
  const { tags } = mock;

  const [activeTag, setActiveTag] = React.useState("All");

  const filteredArticles = articles.filter((article) =>
    activeTag === "All" ? true : article.tags.includes(activeTag),
  );

  const mainArticles = filteredArticles.filter(
    (article) => article.type === "main",
  );
  const sideArticles = articles.filter((article) => article.type === "side");

  return (
    <div className={styles.news}>
      <div className={styles.articles}>
        {mainArticles.map((article) => (
          <Link key={article.id} href={`/news/${article.id}`}>
            <Article type="main" article={article} />
          </Link>
        ))}
      </div>

      <div className={styles.side_articles}>
        <div className={styles.side_articles_header}>
          <div className={cn("heading-6")}>Recent news</div>
        </div>

        {sideArticles.map((article) => (
          <Link key={article.id} href={`/news/${article.id}`}>
            <Article type="side" article={article} />
          </Link>
        ))}

        <div className={styles.tags}>
          {tags.map((tag) => (
            <Tag
              key={tag.id}
              tag={tag}
              activeTag={activeTag}
              setActiveTag={setActiveTag}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;

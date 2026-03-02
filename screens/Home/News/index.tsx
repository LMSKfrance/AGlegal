"use client";

import cn from "classnames";
import styles from "./news.module.css";
import Articles from "@/components/Articles";
import { useLanguage } from "@/contexts/LanguageContext";

type Article = {
  id: string;
  image?: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  tags: string[];
};

const News = ({ articles }: { articles: Article[] }) => {
  const { t } = useLanguage();

  return (
    <div className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <div className={cn("heading-3", styles.title)}>
            {t.ui.news.title}<span className={styles.blue}>.</span>
          </div>
          <div className={cn("paragraph-medium", styles.description)}>
            {t.ui.news.description}
          </div>
        </div>

        <Articles articles={articles} />
      </div>
    </div>
  );
};

export default News;

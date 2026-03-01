import cn from "classnames";
import styles from "./news.module.css";
import Articles from "@/components/Articles";
import { getSortedArticles } from "@/lib/articles";

const News = () => {
  const articles = getSortedArticles();

  return (
    <div className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <div className={cn("heading-3", styles.title)}>
            Legal insights & updates.
          </div>
          <div className={cn("paragraph-medium", styles.description)}>
            Our team of skilled attorneys and legal professionals is dedicated
            to providing you with top-tier legal support.
          </div>
        </div>

        <Articles articles={articles} />
      </div>
    </div>
  );
};

export default News;

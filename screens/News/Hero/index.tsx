import cn from "classnames";
import styles from "./hero.module.css";
import Articles from "@/components/Articles";
import { getSortedArticles } from "@/lib/articles";

const Hero = () => {
  const articles = getSortedArticles();

  return (
    <section className={cn("section")}>
      <div className={cn("container")}>
        <h1 className={cn("hero-2", styles.title)}>News.</h1>

        <Articles articles={articles} />
      </div>
    </section>
  );
};

export default Hero;

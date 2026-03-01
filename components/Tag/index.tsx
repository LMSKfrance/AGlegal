import cn from "classnames";
import styles from "./tag.module.css";

type TagProps = {
  tag: {
    id: number;
    title: string;
  };
  activeTag: string;
  setActiveTag: (tag: string) => void;
};

const Tag = ({ tag, activeTag, setActiveTag }: TagProps) => {
  return (
    <div
      className={cn(styles.tag, {
        [styles.active]: activeTag === tag.title,
      })}
      onClick={() => setActiveTag(tag.title)}
    >
      <div className={cn("label-small", styles.tag_title)}>{tag.title}</div>
    </div>
  );
};

export default Tag;

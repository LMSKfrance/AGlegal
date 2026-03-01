import cn from "classnames";
import styles from "./faq-item.module.css";
import icons from "@/constants/icons";

type FaqItemProps = {
  faq: {
    id: number;
    question: string;
    answer: string;
  };
  open: boolean;
  onToggle: () => void;
  style?: React.CSSProperties;
};

const FaqItem = ({ faq, open, onToggle, style }: FaqItemProps) => {
  return (
    <div
      key={faq.id}
      className={cn(styles.faq)}
      style={style}
      onClick={onToggle}
    >
      <div
        className={cn(styles.faq_header, {
          [styles.open]: open,
        })}
      >
        <h6 className={cn("paragraph-medium", styles.faq_question)}>
          {faq.question}
        </h6>

        {icons.Plus}
      </div>

      {open && (
        <div className={styles.faq_body}>
          <p className={cn("paragraph-small", styles.faq_answer)}>
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default FaqItem;

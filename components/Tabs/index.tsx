import cn from "classnames";
import styles from "./tabs.module.css";

type Tab = {
  id: number;
  title: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: number;
  setActiveTab: (id: number) => void;
  className?: string;
};

const Tabs = ({ tabs, activeTab, setActiveTab, className }: TabsProps) => {
  return (
    <div className={cn(styles.tabs, className)}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(styles.tab, {
            [styles.active]: activeTab === tab.id,
          })}
          onClick={() => setActiveTab(tab.id)}
        >
          <div className={cn("label-medium", styles.tab_title)}>
            {tab.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tabs;

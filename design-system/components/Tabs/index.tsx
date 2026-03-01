"use client";

import React, { useState } from "react";
import cn from "classnames";
import TabComponent from "../Tab";
import styles from "./tabs.module.css";

export type TabItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
};

export type TabsProps = {
  tabs: TabItem[];
  defaultTab?: string;
  orientation?: "horizontal" | "vertical";
  onChange?: (tabId: string) => void;
  className?: string;
};

const Tabs = ({
  tabs,
  defaultTab,
  orientation = "horizontal",
  onChange,
  className,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={className}>
      <div
        role="tablist"
        className={cn(
          styles.tabs,
          orientation === "vertical"
            ? styles["tabs-vertical"]
            : styles["tabs-horizontal"]
        )}
      >
        {tabs.map((tab) => (
          <TabComponent
            key={tab.id}
            label={tab.label}
            icon={tab.icon}
            active={tab.id === activeTab}
            onClick={() => handleSelect(tab.id)}
          />
        ))}
      </div>

      {activeContent && (
        <div role="tabpanel" className={styles.panel}>
          {activeContent}
        </div>
      )}
    </div>
  );
};

export default Tabs;

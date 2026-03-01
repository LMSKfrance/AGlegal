"use client";

import React from "react";
import cn from "classnames";
import styles from "./mission.module.css";
import Image from "next/image";
import icons from "@/constants/icons";
import mock from "@/constants/mock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Mission = () => {
  const { content } = mock;

  const [activeTab, setActiveTab] = React.useState(content[0].id);

  const activeContent = content.find((item) => item.id === activeTab);

  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const imageRef = React.useRef<HTMLDivElement>(null);
  const tabsRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (container.current && title.current && description.current) {
        const chars = title.current.textContent
          ?.split("")
          .map((char) => `<span>${char}</span>`)
          .join("");

        if (chars) {
          title.current.innerHTML = chars;
          const spans = title.current.querySelectorAll("span");

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: container.current,
              start: "top 80%",
              end: "bottom 60%",
              once: true,
            },
          });

          timeline.fromTo(
            spans,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.03,
              ease: "back.out(2)",
              duration: 1,
            },
          );

          timeline.fromTo(
            description.current,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.4",
          );

          if (imageRef.current) {
            gsap.fromTo(
              imageRef.current,
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
              },
            );
          }

          // Animation for the tabs when active
          if (tabsRef.current) {
            const timeline = gsap.timeline();
            timeline.fromTo(
              tabsRef.current,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
              },
            );
          }
        }
      }
    },
    { scope: container },
  );

  return (
    <div ref={container} className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <h3 ref={title} className={cn("heading-3", styles.title)}>
            Our mission: Justice for all.
          </h3>
          <p
            ref={description}
            className={cn("paragraph-medium", styles.description)}
          >
            We are committed to empowering communities by providing exceptional
            legal services with integrity, compassion, and expertise.
          </p>
        </div>

        <div className={styles.content}>
          <div ref={imageRef} className={styles.content_image}>
            <Image
              src={activeContent?.image || ""}
              alt={activeContent?.title || ""}
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div ref={tabsRef} className={styles.content_tabs}>
            {content.map((item) => (
              <div
                key={item.id}
                className={cn(styles.content_tab, {
                  [styles.active]: item.id === activeTab,
                })}
                onClick={() => setActiveTab(item.id)}
              >
                <div
                  className={cn(styles.content_tab_header, {
                    [styles.active_tab_header]: item.id === activeTab,
                  })}
                >
                  <div
                    className={cn("paragraph-x-large", styles.content_title, {
                      [styles.active_title]: item.id === activeTab,
                    })}
                  >
                    {item.title}
                  </div>

                  {icons.Plus}
                </div>
                {item.id === activeTab && (
                  <div
                    className={cn(
                      "paragraph-medium",
                      styles.content_description,
                    )}
                  >
                    {item.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;

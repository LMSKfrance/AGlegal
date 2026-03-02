"use client";

import React from "react";
import cn from "classnames";
import styles from "./process.module.css";
import Image from "next/image";
import Tabs from "@/components/Tabs";
import mock from "@/constants/mock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Process = () => {
  const { tabs } = mock;

  const [activeTab, setActiveTab] = React.useState(1);
  const [displayTab, setDisplayTab] = React.useState(1);
  const prevTab = React.useRef(1);
  const isAnimating = React.useRef(false);

  const content = tabs.find((tab) => tab.id === displayTab)?.content;

  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

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
              duration: 0.8,
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

          timeline.fromTo(
            tabsRef.current,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
            },
          );

          if (contentRef.current) {
            timeline.fromTo(
              contentRef.current,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
              },
              "-=0.6",
            );
          }
        }
      }
    },
    { scope: container },
  );

  React.useEffect(() => {
    if (activeTab === prevTab.current) return;
    const el = contentRef.current;
    if (!el || isAnimating.current) {
      prevTab.current = activeTab;
      setDisplayTab(activeTab);
      return;
    }

    isAnimating.current = true;
    prevTab.current = activeTab;

    gsap.to(el, {
      opacity: 0,
      duration: 0.7,
      ease: "power1.inOut",
      onComplete: () => {
        setDisplayTab(activeTab);

        const img = el.querySelector(`.${styles.image_wrapper}`);
        const figTitle = el.querySelector(`.${styles.figure_title}`);
        const figDesc = el.querySelector(`.${styles.figure_description}`);
        const figNum = el.querySelector(`.${styles.figure_number}`);

        gsap.set(el, { opacity: 1 });

        const tl = gsap.timeline({
          onComplete: () => { isAnimating.current = false; },
        });

        if (img) {
          gsap.set(img, { opacity: 0, scale: 1.04 });
          tl.to(img, { opacity: 1, scale: 1, duration: 1.1, ease: "power1.out" }, 0);
        }
        if (figTitle) {
          gsap.set(figTitle, { opacity: 0, y: 16 });
          tl.to(figTitle, { opacity: 1, y: 0, duration: 0.9, ease: "power1.out" }, 0.15);
        }
        if (figDesc) {
          gsap.set(figDesc, { opacity: 0, y: 12 });
          tl.to(figDesc, { opacity: 1, y: 0, duration: 0.9, ease: "power1.out" }, 0.3);
        }
        if (figNum) {
          gsap.set(figNum, { opacity: 0, y: 10 });
          tl.to(figNum, { opacity: 1, y: 0, duration: 0.9, ease: "power1.out" }, 0.4);
        }
      },
    });
  }, [activeTab]);

  return (
    <div ref={container} className={cn("section")}>
      <div className={cn("container", styles.container)}>
        <div className={styles.title_wrapper}>
          <h3 ref={title} className={cn("heading-3", styles.title)}>
            Our working process.
          </h3>
          <p
            ref={description}
            className={cn("paragraph-large", styles.description)}
          >
            We follow a streamlined process to ensure your legal matters are
            handled efficiently and effectively, keeping you informed every step
            of the way.
          </p>
        </div>

        <div ref={tabsRef}>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            className={styles.tabs}
          />
        </div>

        {content && (
          <div ref={contentRef} className={styles.content}>
            <div className={styles.image_wrapper}>
              <Image
                src={content.image}
                layout="fill"
                objectFit="cover"
                alt={content.title}
              />
            </div>

            <div className={styles.figure_content}>
              <div>
                <div className={cn("paragraph-x-large", styles.figure_title)}>
                  {content.title}
                </div>
                <div
                  className={cn("paragraph-medium", styles.figure_description)}
                >
                  {content.description}
                </div>
              </div>

              <div className={cn("hero-2", styles.figure_number)}>
                {content.number}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Process;

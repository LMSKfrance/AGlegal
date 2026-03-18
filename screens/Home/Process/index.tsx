"use client";

import React from "react";
import cn from "classnames";
import styles from "./process.module.css";
import Image from "next/image";
import Tabs from "@/components/Tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHomeContent } from "../HomeContentContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type TabContent = {
  title: string;
  description: string;
  image: string;
  number: string;
};

const ProcessSlide = ({ content }: { content: TabContent }) => (
  <>
    <div className={styles.image_wrapper}>
      {content.image && (
        <Image
          src={content.image}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={content.title}
          className={styles.image}
        />
      )}
    </div>
    <div className={styles.figure_content}>
      <div>
        <div className={cn("paragraph-x-large", styles.figure_title)}>
          {content.title}
        </div>
        <div className={cn("paragraph-medium", styles.figure_description)}>
          {content.description}
        </div>
      </div>
      <div className={cn("hero-2", styles.figure_number)}>{content.number}</div>
    </div>
  </>
);

const Process = () => {
  const { locale } = useLanguage();
  const { tabs, processHeading } = useHomeContent();

  const firstTabId = tabs[0]?.id ?? 0;
  const [activeTab, setActiveTab] = React.useState(firstTabId);
  const [displayTab, setDisplayTab] = React.useState(firstTabId);
  const [prevDisplayTab, setPrevDisplayTab] = React.useState<number | null>(null);
  const isAnimating = React.useRef(false);

  // Sync to first tab when tabs list changes (e.g. data load)
  const tabIdsKey = React.useMemo(
    () => tabs.map((t) => t.id).join(","),
    [tabs],
  );
  React.useEffect(() => {
    const id = tabs[0]?.id ?? 0;
    setActiveTab(id);
    setDisplayTab(id);
  }, [tabIdsKey, tabs]);

  const content = tabs.find((tab) => tab.id === displayTab)?.content;
  const prevContent = prevDisplayTab
    ? tabs.find((tab) => tab.id === prevDisplayTab)?.content
    : null;

  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const contentWrapperRef = React.useRef<HTMLDivElement>(null);
  const outgoingRef = React.useRef<HTMLDivElement>(null);
  const incomingRef = React.useRef<HTMLDivElement>(null);

  const swipeStart = React.useRef<{ x: number; y: number } | null>(null);

  const handleSwipeStart = React.useCallback(
    (clientX: number, clientY: number) => {
      if (isAnimating.current) return;
      swipeStart.current = { x: clientX, y: clientY };
    },
    [],
  );

  const handleSwipeEnd = React.useCallback(
    (clientX: number) => {
      const start = swipeStart.current;
      swipeStart.current = null;
      if (!start || isAnimating.current) return;

      const deltaX = clientX - start.x;
      const threshold = 50;
      const idx = tabs.findIndex((t) => t.id === displayTab);

      if (deltaX < -threshold && idx >= 0) {
        const nextTab = tabs[idx + 1];
        if (nextTab && nextTab.id !== displayTab) setActiveTab(nextTab.id);
      } else if (deltaX > threshold && idx >= 0) {
        const prevTab = tabs[idx - 1];
        if (prevTab && prevTab.id !== displayTab) setActiveTab(prevTab.id);
      }
    },
    [displayTab, tabs],
  );

  React.useEffect(() => {
    const el = contentWrapperRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) =>
      handleSwipeStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchEnd = (e: TouchEvent) =>
      handleSwipeEnd(e.changedTouches[0].clientX);
    const onMouseDown = (e: MouseEvent) =>
      handleSwipeStart(e.clientX, e.clientY);
    const onMouseUp = (e: MouseEvent) => handleSwipeEnd(e.clientX);

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("mousedown", onMouseDown);

    const onDocMouseUp = (e: MouseEvent) => {
      if (swipeStart.current) handleSwipeEnd(e.clientX);
    };
    document.addEventListener("mouseup", onDocMouseUp);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onDocMouseUp);
    };
  }, [handleSwipeStart, handleSwipeEnd]);

  useGSAP(
    () => {
      if (container.current && title.current && description.current) {
        const titleText = `${processHeading.title}.`;
        const chars = titleText
          .split("")
          .map(
            (char, i, arr) =>
              `<span${char === "." && i === arr.length - 1 ? ` class="${styles.blue}"` : ""}>${char}</span>`,
          )
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

          if (contentWrapperRef.current) {
            timeline.fromTo(
              contentWrapperRef.current,
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
    { scope: container, dependencies: [locale] },
  );

  React.useEffect(() => {
    if (activeTab === displayTab || isAnimating.current) return;
    if (!contentWrapperRef.current) {
      setDisplayTab(activeTab);
      return;
    }

    isAnimating.current = true;
    setPrevDisplayTab(displayTab);
    setDisplayTab(activeTab);

    const direction = activeTab > displayTab ? 1 : -1;
    const slideDistance = "100%";

    const runTransition = () => {
      const outgoing = outgoingRef.current;
      const incoming = incomingRef.current;
      if (!outgoing || !incoming) {
        isAnimating.current = false;
        setPrevDisplayTab(null);
        return;
      }

      gsap.set(outgoing, { x: 0, opacity: 1 });
      gsap.set(incoming, {
        x: direction > 0 ? slideDistance : `-${slideDistance}`,
        opacity: 0,
      });

      const duration = 0.6;
      const ease = "power2.inOut";

      const tl = gsap.timeline({
        onComplete: () => {
          setPrevDisplayTab(null);
          isAnimating.current = false;
        },
      });

      tl.to(
        outgoing,
        {
          x: direction > 0 ? `-${slideDistance}` : slideDistance,
          opacity: 0,
          duration,
          ease,
        },
        0,
      ).to(
        incoming,
        {
          x: 0,
          opacity: 1,
          duration,
          ease,
        },
        0,
      );
    };

    requestAnimationFrame(() => requestAnimationFrame(runTransition));
  }, [activeTab, displayTab]);

  return (
    <div ref={container} className={cn("section")}>
      <div className={cn("container", styles.container)}>
        <div className={styles.title_wrapper}>
          <h3 ref={title} className={cn("heading-3", styles.title)}>
            {processHeading.title}
            <span className={styles.blue}>.</span>
          </h3>
          <p
            ref={description}
            className={cn("paragraph-large", styles.description)}
          >
            {processHeading.description}
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

        <div ref={contentWrapperRef} className={styles.content_wrapper}>
          {prevContent && (
            <div
              ref={outgoingRef}
              className={cn(styles.content, styles.content_slide)}
              aria-hidden
            >
              <ProcessSlide content={prevContent} />
            </div>
          )}
          {content && (
            <div
              ref={prevContent ? incomingRef : undefined}
              className={cn(styles.content, styles.content_slide)}
            >
              <ProcessSlide content={content} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Process;

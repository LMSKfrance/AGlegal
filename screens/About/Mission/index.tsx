"use client";

import React, { useContext } from "react";
import cn from "classnames";
import styles from "./mission.module.css";
import Image from "next/image";
import icons from "@/constants/icons";
import mock from "@/constants/mock";
import gsap from "gsap";
import { AboutContentContext } from "../AboutContentContext";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const CARD_DURATION = 0.225;
const CARD_EASE = "power2.out";

const DEFAULT_MISSION_TITLE = "Our mission: Justice for all.";
const DEFAULT_MISSION_DESCRIPTION =
  "AG Legal Consulting -  Your Trusted Legal Advisors in Georgia";

const Mission = () => {
  const aboutCtx = useContext(AboutContentContext);
  const missionTitle =
    aboutCtx?.sections?.missionTitleEn?.trim() || DEFAULT_MISSION_TITLE;
  const missionDescription =
    aboutCtx?.sections?.missionDescriptionEn?.trim() || DEFAULT_MISSION_DESCRIPTION;
  const { content: mockContent } = mock;
  const content = mockContent.map((item, i) => ({
    ...item,
    image: [
      aboutCtx?.sections?.missionTab1Image,
      aboutCtx?.sections?.missionTab2Image,
      aboutCtx?.sections?.missionTab3Image,
    ][i]?.trim() || item.image,
  }));

  const [activeTab, setActiveTab] = React.useState(content[0].id);
  const [prevImageTab, setPrevImageTab] = React.useState(content[0].id);

  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const imageRef = React.useRef<HTMLDivElement>(null);
  const imageLayerOutRef = React.useRef<HTMLDivElement>(null);
  const imageLayerInRef = React.useRef<HTMLDivElement>(null);
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
              stagger: 0.015,
              ease: "back.out(2)",
              duration: 0.5,
            },
          );

          timeline.fromTo(
            description.current,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            },
            "-=0.4",
          );

          if (imageRef.current) {
            gsap.fromTo(
              imageRef.current,
              { opacity: 0, y: 20, scale: 0.98 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
                overwrite: true,
              },
            );
          }

          if (tabsRef.current) {
            const timeline = gsap.timeline();
            timeline.fromTo(
              tabsRef.current,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
              },
            );
          }
        }
      }
    },
    { scope: container },
  );

  React.useEffect(() => {
    const layerOut = imageLayerOutRef.current;
    const layerIn = imageLayerInRef.current;
    if (!layerOut || !layerIn) return;

    if (activeTab === prevImageTab) {
      gsap.set(layerOut, { opacity: 0 });
      gsap.set(layerIn, { opacity: 1 });
      return;
    }

    gsap.set(layerIn, { opacity: 0, zIndex: 2 });
    gsap.set(layerOut, { opacity: 1, zIndex: 1 });

    gsap.timeline({
      onComplete: () => {
        setPrevImageTab(activeTab);
        gsap.set(layerOut, { opacity: 0, zIndex: 0 });
        gsap.set(layerIn, { opacity: 1, zIndex: 1 });
      },
    })
      .to(layerOut, {
        opacity: 0,
        duration: CARD_DURATION,
        ease: CARD_EASE,
      })
      .to(
        layerIn,
        {
          opacity: 1,
          duration: CARD_DURATION,
          ease: CARD_EASE,
        },
        0,
      );
  }, [activeTab, prevImageTab]);

  const handleTabClick = (id: number) => {
    if (id !== activeTab) setActiveTab(id);
  };

  React.useEffect(() => {
    content.forEach((item) => {
      const img = new window.Image();
      img.src = item.image;
    });
  }, [content]);

  return (
    <div ref={container} className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <h3 ref={title} className={cn("heading-3", styles.title)}>
            {missionTitle}
          </h3>
          <p
            ref={description}
            className={cn("paragraph-medium", styles.description)}
          >
            {missionDescription}
          </p>
        </div>

        <div className={styles.content}>
          <div ref={imageRef} className={styles.content_image}>
            <div
              ref={imageLayerOutRef}
              className={styles.content_image_layer}
              style={{ zIndex: 1 }}
            >
              <Image
                src={content.find((c) => c.id === prevImageTab)?.image || ""}
                alt={content.find((c) => c.id === prevImageTab)?.title || ""}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div
              ref={imageLayerInRef}
              className={styles.content_image_layer}
              style={{ zIndex: 2 }}
            >
              <Image
                src={content.find((c) => c.id === activeTab)?.image || ""}
                alt={content.find((c) => c.id === activeTab)?.title || ""}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          <div ref={tabsRef} className={styles.content_tabs}>
            {content.map((item) => (
              <div
                key={item.id}
                className={cn(styles.content_tab, {
                  [styles.active]: item.id === activeTab,
                })}
                onClick={() => handleTabClick(item.id)}
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
                <div
                  className={cn(styles.content_tab_inner, {
                    [styles.expanded]: item.id === activeTab,
                  })}
                >
                  <div className={styles.content_tab_body}>
                    <div
                      className={cn(
                        "paragraph-medium",
                        styles.content_description,
                      )}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;

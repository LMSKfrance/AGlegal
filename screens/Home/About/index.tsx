"use client";

import React from "react";
import cn from "classnames";
import styles from "./about.module.css";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AgOverlaySvg from "./AgOverlaySvg";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { locale, t } = useLanguage();
  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const mediaRef = React.useRef<HTMLDivElement>(null);
  const imageContainerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        container.current &&
        title.current &&
        description.current &&
        mediaRef.current
      ) {
        const titleText = `${t.ui.about.title}.`;
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
            mediaRef.current,
            { opacity: 0, scale: 0.98 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.4",
          );
        }

        if (imageContainerRef.current) {
          const img = imageContainerRef.current.querySelector("img");
          if (img) {
            gsap.fromTo(
              img,
              { scale: 1.18 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: imageContainerRef.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 2,
                },
              },
            );
          }
        }
      }
    },
    { scope: container, dependencies: [locale] },
  );

  return (
    <div ref={container} id="get-started" className={cn("section", styles.section)}>
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <h2 ref={title} className={cn("heading-3", styles.title)}>
            {t.ui.about.title}<span className={styles.blue}>.</span>
          </h2>
          <p
            ref={description}
            className={cn("paragraph-large", styles.description)}
          >
            {t.ui.about.description}
          </p>
        </div>
      </div>

      {/* Figma 8278-778: image with white AG SVG overlay */}
      <div ref={mediaRef} className={styles.media_block}>
        <div ref={imageContainerRef} className={styles.media_image}>
          <Image
            src="/images/ag-legal-video.jpg"
            fill
            sizes="100vw"
            alt="AG Legal – Who we are"
            priority
            className={styles.image}
          />
        </div>
        <div className={styles.media_overlay} aria-hidden>
          <AgOverlaySvg />
        </div>
      </div>
    </div>
  );
};

export default About;

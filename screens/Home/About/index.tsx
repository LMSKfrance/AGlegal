"use client";

import React from "react";
import cn from "classnames";
import styles from "./about.module.css";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AgOverlaySvg from "./AgOverlaySvg";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const mediaRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        container.current &&
        title.current &&
        description.current &&
        mediaRef.current
      ) {
        const fullText = title.current.textContent || "";
        const chars = fullText
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
      }
    },
    { scope: container },
  );

  return (
    <div ref={container} id="get-started" className={cn("section", styles.section)}>
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <h2 ref={title} className={cn("heading-3", styles.title)}>
            Who we are<span className={styles.blue}>.</span>
          </h2>
          <p
            ref={description}
            className={cn("paragraph-large", styles.description)}
          >
            AG Legal Consulting has been providing expert legal counsel to
            businesses and individuals since 2007. With years of experience and
            a strong reputation, our team is dedicated to being your trusted
            advisor, offering clear and effective guidance through any legal
            challenges
          </p>
        </div>
      </div>

      {/* Figma 8278-778: image with white AG SVG overlay */}
      <div ref={mediaRef} className={styles.media_block}>
        <div className={styles.media_image}>
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

"use client";

import React from "react";
import cn from "classnames";
import styles from "./hero.module.css";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHomeContent } from "../HomeContentContext";

const Hero = () => {
  const { locale } = useLanguage();
  const { hero } = useHomeContent();
  const { brand, title: heroTitle, cta, description: heroDescription, image: heroImage } = hero;
  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const image = React.useRef<HTMLDivElement>(null);
  const divider = React.useRef<HTMLDivElement>(null);
  const button = React.useRef<HTMLButtonElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (
        title.current &&
        image.current &&
        divider.current &&
        button.current &&
        description.current
      ) {
        const bluePrefix = brand;
        // Use translated values directly - don't read from DOM (revert can restore stale content)
        const fullText = `${brand} - ${heroTitle.replace(/\n/g, " ")}.`;
        const chars = fullText
          .split("")
          .map(
            (char, i, arr) =>
              `<span${i < bluePrefix.length || (char === "." && i === arr.length - 1) ? ` class="${styles.blue}"` : ""}>${char}</span>`,
          )
          .join("");
        if (title.current && chars) {
          title.current.innerHTML = chars;

          const spans = title.current.querySelectorAll("span");

          const timeline = gsap.timeline();

          timeline.fromTo(
            spans,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.0125,
              ease: "back.out(2)",
              duration: 0.25,
            },
          );

          timeline.fromTo(
            image.current,
            { opacity: 0, x: 100 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            0,
          );

          timeline.fromTo(
            divider.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left",
              duration: 0.25,
              ease: "power2.out",
            },
            "-=0.1",
          );

          timeline.fromTo(
            button.current,
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.25,
              ease: "back.out(1.7)",
            },
            "-=0.2",
          );

          timeline.fromTo(
            description.current,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.25,
              ease: "power2.out",
            },
            "-=0.3",
          );
        }
      }
    },
    { scope: container, dependencies: [locale, brand, heroTitle] },
  );

  const scrollToSection = () => {
    const targetSection = document.getElementById("get-started");
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div ref={container} className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.content}>
          <h1 ref={title} className={cn("hero-2", styles.title)}>
            <span className={styles.blue}>{brand}</span>
            {" - "}
            <br />
            {heroTitle.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
            <span className={styles.blue}>.</span>
          </h1>

          <div ref={divider} className={styles.divider} />

          <div className={styles.btn_wrapper}>
            <button
              ref={button}
              className={cn("button")}
              onClick={scrollToSection}
            >
              {cta}
            </button>

            <p
              ref={description}
              className={cn("paragraph-large", styles.description)}
            >
              {heroDescription}
            </p>
          </div>
        </div>

        <div ref={image} className={styles.image_wrapper}>
          {heroImage && (
            <Image src={heroImage} alt="AG Legal" layout="fill" objectFit="cover" className={styles.image} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;

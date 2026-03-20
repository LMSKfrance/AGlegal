"use client";

import React from "react";
import cn from "classnames";
import styles from "./hero.module.css";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type AboutPageRecord = {
  titleEn?: string | null;
  contentEn?: string | null;
};

type HeroProps = {
  page: AboutPageRecord | null;
};

const Hero = ({ page }: HeroProps) => {
  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const image = React.useRef<HTMLDivElement>(null);
  const button = React.useRef<HTMLButtonElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (
        title.current &&
        image.current &&
        button.current &&
        description.current
      ) {
        const timeline = gsap.timeline();

        timeline.fromTo(
          title.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "back.out(2)",
            duration: 0.5,
          },
        );

        timeline.fromTo(
          image.current,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          0,
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
          "-=0.2",
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
          "-=0.3",
        );
      }
    },
    { scope: container },
  );

  const scrollToSection = () => {
    const targetSection = document.getElementById("learn-more");
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const headingText = page?.titleEn?.trim();
  const descriptionText = page?.contentEn?.trim();

  return (
    <div ref={container} className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.hero_content}>
          <div ref={title} className={cn("hero-2", styles.title)}>
            {headingText ? (
              headingText
            ) : (
              <>
                Your Trusted Legal Advisors in{" "}
                <span className={styles.accent}>Georgia.</span>
              </>
            )}
          </div>

          <div className={styles.right_column}>
            <p
              ref={description}
              className={cn("paragraph-large", styles.description)}
            >
              {descriptionText ||
                "AG Legal Consulting has provided expert legal services since 2007, advising businesses and individuals in civil and administrative law. We deliver strategic solutions for complex legal challenges."}
            </p>
            <button
              ref={button}
              className={cn("button", styles.button)}
              onClick={scrollToSection}
            >
              LEARN MORE
            </button>
          </div>
        </div>

        <div ref={image} className={styles.image_wrapper}>
          <Image
            src="/images/ag-legal-about.jpg"
            alt="AG Legal Consulting"
            fill
            sizes="(max-width: 1440px) 100vw, 1280px"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;

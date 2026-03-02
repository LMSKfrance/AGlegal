"use client";

import React from "react";
import cn from "classnames";
import styles from "./hero.module.css";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Hero = () => {
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
        const chars = title.current.textContent
          ?.split("")
          .map((char) => `<span>${char}</span>`)
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
              stagger: 0.05,
              ease: "back.out(2)",
              duration: 1,
            },
          );

          timeline.fromTo(
            image.current,
            { opacity: 0, y: 100 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
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
              duration: 0.5,
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
              duration: 0.5,
              ease: "back.out(1.7)",
            },
            "-=0.3",
          );
        }
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

  return (
    <div ref={container} className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <div ref={title} className={cn("hero-2", styles.title)}>
            Your trusted legal partners.
          </div>

          <div className={styles.description_wrapper}>
            <div
              ref={description}
              className={cn("paragraph-large", styles.description)}
            >
              With over 25 years of experience, we provide exceptional legal
              services across various practice areas, empowering our clients to
              navigate complex challenges with confidence.
            </div>
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
            alt="AG Legal"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;

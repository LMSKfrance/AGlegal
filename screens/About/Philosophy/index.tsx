"use client";

import React, { useContext } from "react";
import cn from "classnames";
import styles from "./philosophy.module.css";
import Value from "@/components/Value";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AboutContentContext } from "../AboutContentContext";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_TITLE = "A philosophy of integrity and dedication.";
const DEFAULT_DESCRIPTION =
  "At the heart of our legal practice lies an unwavering commitment to justice, transparency, and exceptional client service.";

const Philosophy = () => {
  const aboutCtx = useContext(AboutContentContext);
  const titleText =
    aboutCtx?.sections?.philosophyTitleEn?.trim() || DEFAULT_TITLE;
  const descriptionText =
    aboutCtx?.sections?.philosophyDescriptionEn?.trim() || DEFAULT_DESCRIPTION;
  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const philosophiesRef = React.useRef<(HTMLDivElement | null)[]>([]);

  const addToRef = (index: number) => (el: HTMLDivElement | null) => {
    philosophiesRef.current[index] = el;
  };

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

          philosophiesRef.current.forEach((philosophy, index) => {
            if (philosophy) {
              timeline.fromTo(
                philosophy,
                { y: 50, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  ease: "power2.out",
                  duration: 0.4,
                },
                `-=${0.3 - index * 0.05}`,
              );
            }
          });
        }
      }
    },
    { scope: container },
  );

  return (
    <section ref={container} className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <h3 ref={title} className={cn("heading-3", styles.title)}>
            {titleText}
          </h3>
          <p
            ref={description}
            className={cn("paragraph-medium", styles.description)}
          >
            {descriptionText}
          </p>
        </div>

        <div className={styles.values}>
          <div ref={addToRef(0)}>
            <Value
              image={aboutCtx?.sections?.philosophyCard1Image?.trim() || "/images/values/integrity-2.jpg"}
              value="Integrity"
              title="Justice and fairness"
              description="We are dedicated to upholding justice and ensuring every client’s rights are protected. Our approach is rooted in fairness, advocacy, and delivering equitable solutions."
            />
          </div>
          <div ref={addToRef(1)}>
            <Value
              image={aboutCtx?.sections?.philosophyCard2Image?.trim() || "/images/values/dedication.jpg"}
              value="Dedication"
              title="Transparency and trust"
              description="Open communication and honesty are pillars of our philosophy. We keep our clients informed at every stage, fostering trust and confidence in our legal process."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;

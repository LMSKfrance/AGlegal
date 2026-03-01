"use client";

import React from "react";
import cn from "classnames";
import styles from "./philosophy.module.css";
import Value from "@/components/Value";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Philosophy = () => {
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

          philosophiesRef.current.forEach((philosophy, index) => {
            if (philosophy) {
              timeline.fromTo(
                philosophy,
                { y: 50, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  ease: "power2.out",
                  duration: 0.8,
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
            A philosophy of integrity and dedication.
          </h3>
          <p
            ref={description}
            className={cn("paragraph-medium", styles.description)}
          >
            At the heart of our legal practice lies an unwavering commitment to
            justice, transparency, and exceptional client service.
          </p>
        </div>

        <div className={styles.values}>
          <div ref={addToRef(0)}>
            <Value
              image="/images/values/integrity-2.jpg"
              value="Integrity"
              title="Justice and fairness"
              description="We are dedicated to upholding justice and ensuring every client’s rights are protected. Our approach is rooted in fairness, advocacy, and delivering equitable solutions."
            />
          </div>
          <div ref={addToRef(1)}>
            <Value
              image="/images/values/dedication.jpg"
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

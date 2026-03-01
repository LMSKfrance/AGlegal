"use client";

import React from "react";
import cn from "classnames";
import styles from "./numbers.module.css";
import Number from "@/components/Number";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Numbers = () => {
  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const numbersRef = React.useRef<(HTMLDivElement | null)[]>([]);

  const addToRef = (index: number) => (el: HTMLDivElement | null) => {
    numbersRef.current[index] = el;
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

          numbersRef.current.forEach((number, index) => {
            if (number) {
              timeline.fromTo(
                number,
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
    <div ref={container} id="learn-more" className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <div ref={title} className={cn("heading-3", styles.title)}>
            Our legacy in numbers.
          </div>
          <div
            ref={description}
            className={cn("paragraph-medium", styles.description)}
          >
            We’re proud of the milestones we’ve achieved over the years,
            showcasing our commitment to excellence in every case we handle.
          </div>
        </div>

        <div className={styles.numbers}>
          <div className={styles.small_numbers}>
            <div ref={addToRef(0)}>
              <Number title="10,000+" subtitle="Successful cases" />
            </div>
            <div ref={addToRef(1)}>
              <Number title="25+" subtitle="Years of experience" />
            </div>
          </div>

          <div ref={addToRef(2)}>
            <Number title="5,000+" subtitle="Satisfied clients" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Numbers;

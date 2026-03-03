"use client";

import React from "react";
import cn from "classnames";
import styles from "./benefits.module.css";
import Benefit from "@/components/Benefit";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHomeContent } from "../HomeContentContext";
import icons from "@/constants/icons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_BENEFIT_ICONS = [icons.Shield, icons.Star, icons.Speaker, icons.Cup];

const Benefits = () => {
  const { locale } = useLanguage();
  const { benefits, benefitsHeading } = useHomeContent();

  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const benefitsRef = React.useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (container.current && title.current) {
        const titleText = benefitsHeading.title;
        const chars = titleText
          .split("")
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

          benefitsRef.current.forEach((benefit, index) => {
            if (benefit) {
              timeline.fromTo(
                benefit,
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
    { scope: container, dependencies: [locale] },
  );

  return (
    <div ref={container} className={cn("section")}>
      <div className={cn("container")}>
        <div ref={title} className={cn("heading-3", styles.title)}>
          {benefitsHeading.title}
        </div>

        <div className={styles.benefits}>
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              ref={(el) => {
                benefitsRef.current[index] = el;
              }}
              className={styles.benefit}
            >
              <Benefit
                benefit={{
                  ...benefit,
                  icon: benefit.iconPath ? undefined : DEFAULT_BENEFIT_ICONS[index % DEFAULT_BENEFIT_ICONS.length],
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benefits;

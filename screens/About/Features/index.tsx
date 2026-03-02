"use client";

import React from "react";
import cn from "classnames";
import styles from "./features.module.css";
import icons from "@/constants/icons";
import mock from "@/constants/mock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const TITLE_TEXT = "What set us apart.";

const Features = () => {
  const { features } = mock;

  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % features.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLDivElement>(null);
  const featuresRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const buttonsRef = React.useRef<(HTMLButtonElement | null)[]>([]);

  useGSAP(
    () => {
      if (container.current && title.current) {
        const spans = title.current.querySelectorAll("span");
        if (spans.length > 0) {
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

          buttonsRef.current.forEach((button) => {
            if (button) {
              timeline.fromTo(
                button,
                { opacity: 0, y: 20 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "power2.out",
                },
              );
            }
          });

          featuresRefs.current.forEach((feature, index) => {
            if (feature) {
              timeline.fromTo(
                feature,
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
    <div ref={container} className={cn("section")}>
      <div className={cn("container", styles.container)}>
        <div className={styles.title_wrapper}>
          <div ref={title} className={cn("heading-3", styles.title)}>
            {TITLE_TEXT.split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </div>

          <div className={styles.btn_wrapper}>
            <button
              ref={(el) => {
                if (el) buttonsRef.current.push(el);
              }}
              className={cn("button-circle-stroke", styles.circle_button)}
              onClick={handlePrev}
            >
              {icons.ChevronLeft}
            </button>
            <button
              ref={(el) => {
                if (el) buttonsRef.current.push(el);
              }}
              className={cn("button-circle", styles.circle_button)}
              onClick={handleNext}
            >
              {icons.ChevronRight}
            </button>
          </div>
        </div>

        <div className={styles.features}>
          <div
            className={styles.features_inner}
            style={{
              transform: `translateX(-${activeIndex * (600 + 48)}px)`, // Feature width + gap
            }}
          >
            {features.map((feature, index) => (
              <div
                key={feature.id}
                ref={(el) => {
                  featuresRefs.current[index] = el;
                }}
                className={styles.feature}
              >
                <div className={styles.feature_icon}>{feature.icon}</div>

                <div>
                  <div
                    className={cn("paragraph-x-large", styles.feature_title)}
                  >
                    {feature.title}
                  </div>
                  <div
                    className={cn(
                      "paragraph-medium",
                      styles.feature_description,
                    )}
                  >
                    {feature.description}
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

export default Features;

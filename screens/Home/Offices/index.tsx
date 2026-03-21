"use client";

import React from "react";
import cn from "classnames";
import styles from "./offices.module.css";
import Marquee from "react-fast-marquee";
import Office from "@/components/Office";
import mock from "@/constants/mock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Offices = () => {
  const { top_offices, bottom_offices } = mock;

  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (container.current && title.current) {
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
              end: "bottom 20%",
              once: true,
            },
          });

          timeline.fromTo(
            spans,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.025,
              ease: "back.out(2)",
              duration: 0.4,
            },
          );
        }
      }
    },
    { scope: container },
  );

  return (
    <div ref={container} className={cn("section")}>
      <div className={cn("container")}>
        <div ref={title} className={cn("heading-3", styles.title)}>
          Our offices.
        </div>
      </div>

      <div className={styles.marquees}>
        <Marquee className={styles.marquee} gradient autoFill>
          <div className={styles.marquee_wrapper}>
            {top_offices.map((office) => (
              <Office key={office.id} office={office} />
            ))}
          </div>
        </Marquee>

        <Marquee className={styles.marquee} gradient direction="right" autoFill>
          <div className={styles.marquee_wrapper}>
            {bottom_offices.map((office) => (
              <Office key={office.id} office={office} />
            ))}
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default Offices;

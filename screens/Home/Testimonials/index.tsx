"use client";

import React from "react";
import cn from "classnames";
import styles from "./testimonials.module.css";
import Marquee from "react-fast-marquee";
import Testimonial from "@/components/Testimonial";
import mock from "@/constants/mock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const { top_testimonials, bottom_testimonials } = mock;

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
              stagger: 0.05,
              ease: "back.out(2)",
              duration: 0.8,
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
          What our clients say.
        </div>
      </div>

      <div className={styles.testimonials}>
        <Marquee gradient>
          <div className={styles.marquee_wrapper}>
            {top_testimonials.map((testimonial) => (
              <Testimonial key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </Marquee>

        <Marquee className={styles.marquee} direction="right" gradient>
          <div className={styles.marquee_wrapper}>
            {bottom_testimonials.map((testimonial) => (
              <Testimonial key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default Testimonials;

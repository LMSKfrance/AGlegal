"use client";

import React from "react";
import cn from "classnames";
import styles from "./hero.module.css";
import Member from "@/components/Member";
import mock from "@/constants/mock";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Hero = () => {
  const { members } = mock;

  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const teamRef = React.useRef<(HTMLDivElement | null)[]>([]);

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

          const timeline = gsap.timeline();

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

          teamRef.current.forEach((team, index) => {
            if (team) {
              timeline.fromTo(
                team,
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
        <h1 ref={title} className={cn("hero-2", styles.title)}>
          Our team.
        </h1>

        <div className={styles.members}>
          {members.map((member, index) => (
            <div
              key={member.id}
              ref={(el) => {
                teamRef.current[index] = el;
              }}
              className={styles.benefit}
            >
              <Member key={member.id} member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

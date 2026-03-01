"use client";

import React from "react";
import cn from "classnames";
import styles from "./team.module.css";
import Member from "@/components/Member";
import mock from "@/constants/mock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Team = () => {
  const { members } = mock;
  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const membersRef = React.useRef<(HTMLDivElement | null)[]>([]);

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
              ease: "power2.out",
              duration: 0.8,
            },
            "-=0.5",
          );

          membersRef.current.forEach((member, index) => {
            if (member) {
              timeline.fromTo(
                member,
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
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <h3 ref={title} className={cn("heading-3", styles.title)}>
            Meet our team.
          </h3>
          <p
            ref={description}
            className={cn("paragraph-large", styles.description)}
          >
            Our team of skilled attorneys and legal professionals is dedicated
            to providing you with top-tier legal support.
          </p>
        </div>

        <div className={styles.members}>
          {members.map((member, index) => (
            <div
              key={member.id}
              ref={(el) => {
                membersRef.current[index] = el;
              }}
              className={styles.benefit}
            >
              <Member key={member.id} member={member} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;

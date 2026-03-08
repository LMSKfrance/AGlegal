"use client";

import React from "react";
import cn from "classnames";
import styles from "./hero.module.css";
import Member from "@/components/Member";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { TeamMember } from "@/lib/types/team";

type HeroProps = {
  members: TeamMember[];
};

const Hero = ({ members }: HeroProps) => {

  const container = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const membersRef = React.useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!container.current || !titleRef.current) return;

      const timeline = gsap.timeline();

      timeline.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
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
    },
    { scope: container },
  );

  return (
    <section ref={container} className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <h1 ref={titleRef} className={cn("hero-2", styles.title)}>
          Our team.
        </h1>

        <div className={styles.members}>
          {members.map((member, index) => (
            <div
              key={member.id}
              ref={(el) => {
                membersRef.current[index] = el;
              }}
            >
              <Member member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

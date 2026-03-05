"use client";

import React, { useContext } from "react";
import cn from "classnames";
import styles from "./team.module.css";
import Member from "@/components/Member";
import { useLanguage } from "@/contexts/LanguageContext";
import { HomeContentContext } from "@/screens/Home/HomeContentContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { TeamMember } from "@/lib/team";

gsap.registerPlugin(ScrollTrigger);

type TeamProps = {
  /** When provided (e.g. on About page), use these members instead of context/fallback */
  members?: TeamMember[];
};

const Team = ({ members: membersProp }: TeamProps) => {
  const homeCtx = useContext(HomeContentContext);
  const { locale, t } = useLanguage();
  const fromContext =
    homeCtx ? (locale === "ka" ? homeCtx.contentKa.teamMembers : homeCtx.contentEn.teamMembers) : t.members;
  const membersList = Array.isArray(membersProp) && membersProp.length > 0
    ? membersProp
    : Array.isArray(fromContext)
      ? fromContext
      : [];
  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const membersRef = React.useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (container.current && title.current) {
        const titleText = `${t.ui.team.title}.`;
        const chars = titleText
          .split("")
          .map(
            (char, i, arr) =>
              `<span${char === "." && i === arr.length - 1 ? ` class="${styles.blue}"` : ""}>${char}</span>`,
          )
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
    { scope: container, dependencies: [locale, membersList] },
  );

  return (
    <div ref={container} className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <h3 ref={title} className={cn("heading-3", styles.title)}>
            {t.ui.team.title}<span className={styles.blue}>.</span>
          </h3>
          <p
            ref={description}
            className={cn("paragraph-large", styles.description)}
          >
            {t.ui.team.description}
          </p>
        </div>

        <div className={styles.members}>
          {membersList.map((member, index) => (
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

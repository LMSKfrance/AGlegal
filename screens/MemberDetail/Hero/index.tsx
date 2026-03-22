"use client";

import React from "react";
import cn from "classnames";
import styles from "./hero.module.css";
import Image from "next/image";
import Member from "@/components/Member";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import type { TeamMember } from "@/lib/types/team";

type HeroProps = {
  member: TeamMember;
  otherMembers: TeamMember[];
};

const Hero = ({ member, otherMembers }: HeroProps) => {
  const container = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const bioRef = React.useRef<HTMLDivElement>(null);
  const teamRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      const tl = gsap.timeline();

      if (cardRef.current) {
        tl.fromTo(
          cardRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
        );
      }

      if (bioRef.current) {
        tl.fromTo(
          bioRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, stagger: 0.1, ease: "power2.out" },
          "-=0.3",
        );
      }

      if (teamRef.current) {
        tl.fromTo(
          teamRef.current.querySelectorAll(`.${styles.other_card}`),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, stagger: 0.04, ease: "power2.out" },
          "-=0.2",
        );
      }
    },
    { scope: container },
  );

  return (
    <div ref={container}>
      {/* Member profile section */}
      <section className={cn("section", styles.profile_section)}>
        <div className={cn("container", styles.profile_container)}>

          {/* Card: image left + info & quote right */}
          <div ref={cardRef} className={styles.member_card}>
            <div className={styles.card_image}>
              <Image
                src={member.image}
                alt={member.title}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                style={{ objectFit: "cover", objectPosition: member.imagePosition === "bottom" ? "bottom center" : member.imagePosition === "center" ? "center" : "top center" }}
                priority
              />
            </div>

            <div className={styles.card_content}>
              {/* Name + position + socials */}
              <div className={styles.card_top}>
                <div className={styles.card_info}>
                  <h1 className={cn("paragraph-x-large", styles.card_name)}>
                    {member.title}
                  </h1>
                  <p className={cn("paragraph-medium", styles.card_position)}>
                    {member.position}
                  </p>
                </div>
                <div className={styles.card_socials}>
                  {member.socials.map((social) => (
                    <a
                      key={social.id}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.social_btn}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Blue divider */}
              <div className={styles.card_divider} />

              {/* Quote */}
              <p className={cn("heading-6", styles.card_quote)}>
                &ldquo;{member.quote}&rdquo;
              </p>
            </div>
          </div>

          {/* Bio paragraphs below card */}
          <div ref={bioRef} className={styles.bio_block}>
            <p className={cn("paragraph-medium", styles.bio_text)}>
              {member.text1}
            </p>
            <p className={cn("paragraph-medium", styles.bio_text)}>
              {member.text2}
            </p>
          </div>
        </div>
      </section>

      {/* Explore team section */}
      <section className={cn("section", styles.team_section)}>
        <div className={cn("container", styles.team_container)}>
          <div className={styles.team_header}>
            <h2 className={cn(styles.team_title)}>
              Explore Our team<span className={styles.accent}>.</span>
            </h2>
            <p className={cn("paragraph-medium", styles.team_subtitle)}>
              Our team of skilled attorneys and legal professionals is dedicated
              to providing you with top-tier legal support.
            </p>
          </div>

          <div ref={teamRef} className={styles.team_grid}>
            {otherMembers.map((otherMember) => (
              <div key={otherMember.id} className={styles.other_card}>
                <Member member={otherMember} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;

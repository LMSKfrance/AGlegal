"use client";

import React from "react";
import cn from "classnames";
import styles from "./hero.module.css";
import Image from "next/image";
import Member from "@/components/Member";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type MemberType = {
  id: number;
  slug: string;
  title: string;
  position: string;
  description: string;
  quote: string;
  text1: string;
  text2: string;
  image: string;
  socials: {
    id: number;
    name: string;
    icon: React.ReactNode;
    link: string;
  }[];
};

type HeroProps = {
  member: MemberType;
  otherMembers: MemberType[];
};

const Hero = ({ member, otherMembers }: HeroProps) => {
  const container = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const teamRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      const tl = gsap.timeline();

      if (cardRef.current) {
        tl.fromTo(
          cardRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        );
      }

      if (contentRef.current) {
        tl.fromTo(
          contentRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.2, ease: "power2.out" },
          "-=0.5",
        );
      }

      if (teamRef.current) {
        tl.fromTo(
          teamRef.current.querySelectorAll(`.${styles.other_card}`),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" },
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

          {/* Large member card */}
          <div ref={cardRef} className={styles.member_card}>
            <div className={styles.card_image}>
              <Image
                src={member.image}
                alt={member.title}
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            <div className={styles.card_content}>
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
          </div>

          {/* Quote + bio block */}
          <div ref={contentRef} className={styles.content_block}>
            {/* Left: quote */}
            <div className={styles.quote_col}>
              <div className={styles.quote_wrapper}>
                <div className={styles.quote_line} />
                <p className={cn("heading-6", styles.quote_text)}>
                  &ldquo;{member.quote}&rdquo;
                </p>
              </div>
            </div>

            {/* Right: bio */}
            <div className={styles.bio_col}>
              <p className={cn("paragraph-medium", styles.bio_text)}>
                {member.text1}
              </p>
              <p className={cn("paragraph-medium", styles.bio_text)}>
                {member.text2}
              </p>
            </div>
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

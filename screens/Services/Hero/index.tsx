"use client";

import React from "react";
import cn from "classnames";
import styles from "./hero.module.css";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Service } from "@/lib/services";

type PageRecord = {
  titleEn?: string | null;
  contentEn?: string | null;
} | null;

type HeroProps = {
  services: Service[];
  page?: PageRecord;
};

const FALLBACK_TITLE = "Our services";
const FALLBACK_PARAS = [
  "Navigating the complexities of business law is crucial to the success and longevity of your company. Whether you're starting a new business or looking to expand or protect an established one, our experienced legal team is here to provide expert support.",
  "We offer comprehensive services to businesses of all sizes, from startups to established enterprises, ensuring that every aspect of your business operations remains legally sound and compliant.",
];

const Hero = ({ services, page }: HeroProps) => {
  const container = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const descRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current || !titleRef.current) return;

      const timeline = gsap.timeline();

      timeline.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
      );

      if (descRef.current) {
        timeline.fromTo(
          descRef.current.querySelectorAll("p"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.35,
            stagger: 0.075,
            ease: "power2.out",
          },
          "-=0.5",
        );
      }

      if (gridRef.current) {
        timeline.fromTo(
          gridRef.current.querySelectorAll(`.${styles.service_item}`),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.25,
            stagger: 0.02,
            ease: "power2.out",
          },
          "-=0.3",
        );
      }
    },
    { scope: container },
  );

  const titleDisplay =
    page?.titleEn?.trim()?.replace(/\.+$/, "") || FALLBACK_TITLE;
  const descriptionParagraphs = page?.contentEn?.trim()
    ? page.contentEn.trim().split(/\n\n+/).filter(Boolean)
    : FALLBACK_PARAS;

  return (
    <section ref={container} className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <h1 ref={titleRef} className={cn(styles.title)}>
          {titleDisplay}<span className={styles.accent}>.</span>
        </h1>

        <div ref={descRef} className={styles.description}>
          {descriptionParagraphs.map((text, i) => (
            <p
              key={i}
              className={cn("paragraph-x-large", styles.desc_text)}
            >
              {text}
            </p>
          ))}
        </div>

        {services.length > 0 && (
          <div ref={gridRef} className={styles.grid}>
            {[0, 1, 2].map((colIndex) => {
              const perCol = Math.ceil(services.length / 3);
              const colServices = services.slice(colIndex * perCol, (colIndex + 1) * perCol);
              return (
                <div key={colIndex} className={styles.column}>
                  {colServices.map((service) =>
                    service.clickable ? (
                      <Link
                        key={service.id}
                        href={`/services/${service.slug}`}
                        className={styles.service_item}
                      >
                        {service.title}
                      </Link>
                    ) : (
                      <span
                        key={service.id}
                        className={`${styles.service_item} ${styles.service_item_static}`}
                      >
                        {service.title}
                      </span>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;

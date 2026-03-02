"use client";

import React from "react";
import cn from "classnames";
import styles from "./hero.module.css";
import mock from "@/constants/mock";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Hero = () => {
  const { services } = mock;

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
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
      );

      if (descRef.current) {
        timeline.fromTo(
          descRef.current.querySelectorAll("p"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
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
            duration: 0.5,
            stagger: 0.04,
            ease: "power2.out",
          },
          "-=0.3",
        );
      }
    },
    { scope: container },
  );

  return (
    <section ref={container} className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <h1 ref={titleRef} className={cn(styles.title)}>
          Our services<span className={styles.accent}>.</span>
        </h1>

        <div ref={descRef} className={styles.description}>
          <p className={cn("paragraph-x-large", styles.desc_text)}>
            Navigating the complexities of business law is crucial to the
            success and longevity of your company. Whether you&apos;re starting
            a new business or looking to expand or protect an established one,
            our experienced legal team is here to provide expert support.
          </p>
          <p className={cn("paragraph-x-large", styles.desc_text)}>
            We offer comprehensive services to businesses of all sizes, from
            startups to established enterprises, ensuring that every aspect of
            your business operations remains legally sound and compliant.
          </p>
        </div>

        <div ref={gridRef} className={styles.grid}>
          {[0, 1, 2].map((colIndex) => (
            <div key={colIndex} className={styles.column}>
              {services.map((service) => (
                <Link
                  key={`${colIndex}-${service.id}`}
                  href={`/services/${service.slug}`}
                  className={styles.service_item}
                >
                  {service.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

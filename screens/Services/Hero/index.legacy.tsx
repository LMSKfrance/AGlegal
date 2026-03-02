"use client";

import React from "react";
import cn from "classnames";
import styles from "./hero.module.css";
import Image from "next/image";
import icons from "@/constants/icons";
import mock from "@/constants/mock";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Hero = () => {
  const { services } = mock;

  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const servicesRef = React.useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (container.current && title.current) {
        const fullText = title.current.textContent || "";
        const chars = fullText
          .split("")
          .map(
            (char, i, arr) =>
              `<span${char === "." && i === arr.length - 1 ? ` class="${styles.accent}"` : ""}>${char}</span>`,
          )
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

          servicesRef.current.forEach((service, index) => {
            if (service) {
              timeline.fromTo(
                service,
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
    <section ref={container} className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <h1 ref={title} className={cn("heading-3", styles.title)}>
          Our services<span className={styles.accent}>.</span>
        </h1>

        <div className={styles.services}>
          {services.map((service, index) => (
            <div
              key={service.id}
              className={cn(styles.service, index % 2 === 1 && styles.service_reverse)}
              ref={(el) => {
                servicesRef.current[index] = el;
              }}
            >
              <Link
                href={`/services/${service.slug}`}
                className={styles.service_image}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </Link>

              <Link
                href={`/services/${service.slug}`}
                className={styles.service_content}
              >
                <div>
                  <div
                    className={cn("paragraph-x-large", styles.service_title)}
                  >
                    {service.title}
                  </div>
                  <div
                    className={cn(
                      "paragraph-medium",
                      styles.service_description,
                    )}
                  >
                    {service.description}
                  </div>
                </div>

                <div className={styles.service_button}>
                  <div className={styles.button_circle}>
                    {icons.ArrowUpRight}
                  </div>
                  <span className={cn("label-small", styles.service_button_title)}>
                    Learn more
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

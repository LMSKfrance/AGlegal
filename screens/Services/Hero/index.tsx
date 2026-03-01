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
    <section ref={container} className={cn("section")}>
      <div className={cn("container")}>
        <h1 ref={title} className={cn("hero-2", styles.title)}>
          Our Services.
        </h1>

        <div className={styles.services}>
          {services.map((service, index) => (
            <div
              key={service.id}
              className={styles.service}
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
                  alt="Picture of the author"
                  layout="fill"
                  objectFit="cover"
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

                <button className={styles.service_button}>
                  <div className={cn("button-circle")}>
                    {icons.ArrowUpRight}
                  </div>
                  <div
                    className={cn("label-small", styles.service_button_title)}
                  >
                    Learn more
                  </div>
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

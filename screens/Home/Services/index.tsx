"use client";

import React from "react";
import cn from "classnames";
import styles from "./services.module.css";
import Service from "@/components/Service";
import mock from "@/constants/mock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const { services } = mock;

  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const serviceRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (container.current && title.current && description.current) {
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
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.4",
          );

          serviceRefs.current.forEach((service, index) => {
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
    <div ref={container} className={cn("section")}>
      <div className={cn("container", styles.container)}>
        <div className={styles.title_wrapper}>
          <h3 ref={title} className={cn("heading-3", styles.title)}>
            Our legal services.
          </h3>
          <p
            ref={description}
            className={cn("paragraph-large", styles.description)}
          >
            Whether you are a business owner, individual, or family in need of
            legal assistance, our team of experienced attorneys offers
            personalized solutions tailored to your unique needs.
          </p>
        </div>

        <div className={styles.services}>
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => {
                serviceRefs.current[index] = el;
              }}
              className={styles.service}
            >
              <Service service={service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;

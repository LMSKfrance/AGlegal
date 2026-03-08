"use client";

import React from "react";
import cn from "classnames";
import styles from "./services.module.css";
import Service from "@/components/Service";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHomeContent } from "../HomeContentContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const { locale } = useLanguage();
  const { services, servicesHeading } = useHomeContent();

  const container = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const serviceRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (container.current && title.current && description.current) {
        const titleText = `${servicesHeading.title}.`;
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
    { scope: container, dependencies: [locale] },
  );

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let step = 0;
    let paused = false;
    let timer: ReturnType<typeof setTimeout>;

    const scrollToCard = (index: number, onDone?: () => void) => {
      const cards = serviceRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!cards[index]) return;
      const target = cards[index];
      const scrollTarget =
        target.offsetLeft - el.offsetLeft - (el.clientWidth - target.offsetWidth) / 2;

      gsap.to(el, {
        scrollLeft: Math.max(0, Math.min(scrollTarget, el.scrollWidth - el.clientWidth)),
        duration: 2,
        ease: "power1.inOut",
        onComplete: onDone,
      });
    };

    const advance = () => {
      if (paused) return;
      const cards = serviceRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length === 0) return;

      step = (step + 1) % cards.length;
      scrollToCard(step, () => {
        timer = setTimeout(advance, 3000);
      });
    };

    const fullSweep = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) {
        timer = setTimeout(advance, 3000);
        return;
      }

      gsap.to(el, {
        scrollLeft: maxScroll * 0.6,
        duration: 3.5,
        ease: "power1.inOut",
        onComplete: () => {
          gsap.to(el, {
            scrollLeft: 0,
            duration: 3,
            ease: "power1.inOut",
            onComplete: () => {
              step = 0;
              timer = setTimeout(advance, 2000);
            },
          });
        },
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(fullSweep, 1500);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);

    const pause = () => {
      paused = true;
      clearTimeout(timer);
      gsap.killTweensOf(el);
    };
    const resume = () => {
      paused = false;
      timer = setTimeout(advance, 2000);
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);

    return () => {
      clearTimeout(timer);
      gsap.killTweensOf(el);
      observer.disconnect();
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  return (
    <div ref={container} className={cn("section")}>
      <div className={cn("container", styles.container)}>
        <div className={styles.title_wrapper}>
          <h3 ref={title} className={cn("heading-3", styles.title)}>
            {servicesHeading.title}
            <span className={styles.blue}>.</span>
          </h3>
          <p
            ref={description}
            className={cn("paragraph-large", styles.description)}
          >
            {servicesHeading.description}
          </p>
        </div>

        <div ref={scrollRef} className={styles.services}>
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

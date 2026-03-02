"use client";

import React from "react";
import cn from "classnames";
import styles from "./faq.module.css";
import FaqItem from "@/components/FaqItem";
import { useLanguage } from "@/contexts/LanguageContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FAQ = () => {
  const { locale, t } = useLanguage();
  const { faqs } = t;
  const TITLE_TEXT = t.ui.faq.title;

  const [open, setOpen] = React.useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpen((prev) => (prev === id ? null : id));
  };

  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLDivElement>(null);
  const faqsRef = React.useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (container.current && title.current) {
        const spans = title.current.querySelectorAll("span");
        if (spans.length > 0) {
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

          faqsRef.current.forEach((faq, index) => {
            if (faq) {
              timeline.fromTo(
                faq,
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

  return (
    <div ref={container} className={cn("section")}>
      <div className={cn("container")}>
        <div ref={title} className={cn("heading-3", styles.title)}>
          {TITLE_TEXT.split("").map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </div>

        <div className={styles.faqs}>
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              ref={(el) => {
                faqsRef.current[index] = el;
              }}
            >
              <FaqItem
                key={faq.id}
                faq={faq}
                open={open === faq.id}
                onToggle={() => handleToggle(faq.id)}
                style={{
                  borderBottom:
                    index === faqs.length - 1 ? "none" : "1px solid #E5E5E5",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;

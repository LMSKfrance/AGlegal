"use client";

import React, { useContext } from "react";
import cn from "classnames";
import styles from "./numbers.module.css";
import Number from "@/components/Number";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AboutContentContext } from "../AboutContentContext";
import { useLanguage } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_TITLE = "Our legacy in numbers.";
const DEFAULT_DESCRIPTION =
  "We're proud of the milestones we've achieved over the years, showcasing our commitment to excellence in every case we handle.";
const DEFAULT_TITLE_KA = "ჩვენი მემკვიდრეობა რიცხვებში.";
const DEFAULT_DESCRIPTION_KA =
  "ვამაყობთ წლების განმავლობაში მიღწეული შედეგებით, რაც ასახავს ჩვენს ერთგულებას სრულყოფილობისადმი.";

const Numbers = () => {
  const { locale } = useLanguage();
  const aboutCtx = useContext(AboutContentContext);
  const s = aboutCtx?.sections;

  const titleText = locale === "ka"
    ? s?.numbersTitleKa?.trim() || s?.numbersTitleEn?.trim() || DEFAULT_TITLE_KA
    : s?.numbersTitleEn?.trim() || DEFAULT_TITLE;
  const descriptionText = locale === "ka"
    ? s?.numbersDescriptionKa?.trim() || s?.numbersDescriptionEn?.trim() || DEFAULT_DESCRIPTION_KA
    : s?.numbersDescriptionEn?.trim() || DEFAULT_DESCRIPTION;

  // Stats with CMS overrides and locale-aware labels
  const stat1 = { value: s?.stat1Value?.trim() || "10,000+", label: locale === "ka" ? s?.stat1LabelKa?.trim() || s?.stat1LabelEn?.trim() || "წარმატებული საქმეები" : s?.stat1LabelEn?.trim() || "Successful cases" };
  const stat2 = { value: s?.stat2Value?.trim() || "20+", label: locale === "ka" ? s?.stat2LabelKa?.trim() || s?.stat2LabelEn?.trim() || "წლიანი გამოცდილება" : s?.stat2LabelEn?.trim() || "Years of experience" };
  const stat3 = { value: s?.stat3Value?.trim() || "5,000+", label: locale === "ka" ? s?.stat3LabelKa?.trim() || s?.stat3LabelEn?.trim() || "კმაყოფილი კლიენტი" : s?.stat3LabelEn?.trim() || "Satisfied clients" };

  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const numbersRef = React.useRef<(HTMLDivElement | null)[]>([]);

  const addToRef = (index: number) => (el: HTMLDivElement | null) => {
    numbersRef.current[index] = el;
  };

  useGSAP(
    () => {
      if (container.current && title.current && description.current) {
        if (title.current.textContent) {
          const text = title.current.textContent;
          const accentStart = text.indexOf("numbers.");
          const beforeAccent = text.slice(0, accentStart);
          const accent = text.slice(accentStart);
          const beforeSpans = beforeAccent
            .split("")
            .map((c) => `<span>${c}</span>`)
            .join("");
          title.current.innerHTML = `${beforeSpans}<span class="${styles.accent}">${accent}</span>`;
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
              stagger: 0.015,
              ease: "back.out(2)",
              duration: 0.5,
            },
          );

          timeline.fromTo(
            description.current,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            },
            "-=0.4",
          );

          numbersRef.current.forEach((number, index) => {
            if (number) {
              timeline.fromTo(
                number,
                { y: 50, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  ease: "power2.out",
                  duration: 0.4,
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
    <div ref={container} id="learn-more" className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <div ref={title} className={cn("heading-3", styles.title)}>
            {titleText}
          </div>
          <div
            ref={description}
            className={cn("paragraph-medium", styles.description)}
          >
            {descriptionText}
          </div>
        </div>

        <div className={styles.numbers}>
          <div className={styles.left_column}>
            <div ref={addToRef(0)}>
              <Number title={stat1.value} subtitle={stat1.label} />
            </div>
            <div ref={addToRef(1)}>
              <Number title={stat2.value} subtitle={stat2.label} />
            </div>
          </div>

          <div ref={addToRef(2)} className={styles.right_card}>
            <Number title={stat3.value} subtitle={stat3.label} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Numbers;

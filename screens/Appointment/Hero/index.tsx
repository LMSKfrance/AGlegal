"use client";

import React from "react";
import cn from "classnames";
import styles from "./hero.module.css";
import Image from "next/image";
import AppointmentForm from "@/components/AppointmentForm";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type AppointmentPageRecord = {
  titleEn?: string | null;
  contentEn?: string | null;
};

type HeroProps = {
  page: AppointmentPageRecord | null;
};

const Hero = ({ page }: HeroProps) => {
  const container = React.useRef<HTMLDivElement>(null);
  const image = React.useRef<HTMLDivElement>(null);
  const form = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (image.current && form.current) {
        const timeline = gsap.timeline();

        timeline.fromTo(
          image.current,
          { opacity: 0, x: 100 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          0,
        );

        timeline.fromTo(
          form.current,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          0,
        );
      }
    },
    { scope: container },
  );

  const headingText = page?.titleEn?.trim();
  const descriptionText = page?.contentEn?.trim();

  return (
    <section ref={container} className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div ref={image} className={styles.image_wrapper}>
          <Image
            src="/images/ag-legal.jpg"
            alt="AG Legal"
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div ref={form} className={styles.form_wrapper}>
          {headingText && (
            <div className={cn("heading-3", styles.title)}>
              {headingText}
            </div>
          )}
          {descriptionText && (
            <p className={cn("paragraph-large", styles.description)}>
              {descriptionText}
            </p>
          )}
          <AppointmentForm className={styles.form} />
        </div>
      </div>
    </section>
  );
};

export default Hero;

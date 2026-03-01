"use client";

import React from "react";
import cn from "classnames";
import styles from "./hero.module.css";
import Image from "next/image";
import AppointmentForm from "@/components/AppointmentForm";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Hero = () => {
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
            duration: 1,
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
            duration: 1,
            ease: "power2.out",
          },
          0,
        );
      }
    },
    { scope: container },
  );

  return (
    <section ref={container} className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div ref={image} className={styles.image_wrapper}>
          <Image
            src="/images/lexa-firm.jpg"
            alt="hero"
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div ref={form}>
          <AppointmentForm className={styles.form} />
        </div>
      </div>
    </section>
  );
};

export default Hero;

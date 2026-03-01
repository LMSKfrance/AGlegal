"use client";

import React from "react";
import cn from "classnames";
import styles from "./about.module.css";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import icons from "@/constants/icons";
import VideoModal from "@/components/VideoModal";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const videoWrapper = React.useRef<HTMLDivElement>(null);

  const [modalOpen, setModalOpen] = React.useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  useGSAP(
    () => {
      if (
        container.current &&
        title.current &&
        description.current &&
        videoWrapper.current
      ) {
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
              duration: 0.8,
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

          timeline.fromTo(
            videoWrapper.current,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.4",
          );
        }
      }
    },
    { scope: container },
  );

  return (
    <div ref={container} id="get-started" className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.title_wrapper}>
          <h2 ref={title} className={cn("heading-3", styles.title)}>
            Who we are.
          </h2>
          <p
            ref={description}
            className={cn("paragraph-large", styles.description)}
          >
            With over 20 years of experience, Lexa Firm is committed to
            delivering exceptional legal services. Our team of skilled attorneys
            specializes in diverse practice areas to meet the unique needs of
            individuals and businesses.
          </p>
        </div>
      </div>

      <div ref={videoWrapper} className={styles.video_wrapper}>
        <Image
          src="/images/lexa-firm-video.jpg"
          layout="fill"
          objectFit="cover"
          alt="Lexa Firm Video"
          priority
        />

        <button
          className={styles.play_button}
          onClick={toggleModal}
          aria-label="Play Video"
        >
          {icons.Play}
        </button>
      </div>

      {modalOpen && <VideoModal toggleModal={toggleModal} />}
    </div>
  );
};

export default About;

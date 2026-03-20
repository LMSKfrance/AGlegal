"use client";

import React from "react";
import cn from "classnames";
import styles from "./hero.module.css";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type ContactSettingsRecord = {
  titleEn?: string | null;
  subtitleEn?: string | null;
  addressEn?: string | null;
  email?: string | null;
  phone?: string | null;
  secondaryPhone?: string | null;
  mapEmbedUrl?: string | null;
};

type PageRecord = {
  titleEn?: string | null;
  contentEn?: string | null;
} | null;

type HeroProps = {
  contact: ContactSettingsRecord | null;
  page?: PageRecord;
};

const Hero = ({ contact, page }: HeroProps) => {
  const container = React.useRef<HTMLDivElement>(null);
  const title = React.useRef<HTMLHeadingElement>(null);
  const image = React.useRef<HTMLDivElement>(null);
  const divider = React.useRef<HTMLDivElement>(null);
  const description = React.useRef<HTMLParagraphElement>(null);
  const detailsTitles = React.useRef<(HTMLDivElement | null)[]>([]);
  const detailsTexts = React.useRef<(HTMLDivElement | null)[]>([]);
  const formTitle = React.useRef<HTMLDivElement>(null);
  const formContainer = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        title.current &&
        divider.current &&
        image.current &&
        description.current &&
        formTitle.current &&
        formContainer.current
      ) {
        const chars = title.current.textContent
          ?.split("")
          .map((char) => `<span>${char}</span>`)
          .join("");
        if (title.current && chars) {
          title.current.innerHTML = chars;

          const spans = title.current.querySelectorAll("span");

          const timeline = gsap.timeline();

          timeline.fromTo(
            spans,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.05,
              ease: "back.out(2)",
              duration: 1,
            },
          );

          timeline.fromTo(
            description.current,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.1",
          );

          timeline.fromTo(
            divider.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left",
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.3",
          );

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

          detailsTitles.current.forEach((title, index) => {
            if (title) {
              timeline.fromTo(
                title,
                { opacity: 0, y: 20 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "power2.out",
                  stagger: 0.1,
                },
                `-=${0.2 + index * 0.1}`,
              );
            }
          });

          detailsTexts.current.forEach((text, index) => {
            if (text) {
              timeline.fromTo(
                text,
                { opacity: 0, y: 20 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "power2.out",
                  stagger: 0.1,
                },
                `-=${0.3 + index * 0.1}`,
              );
            }
          });

          timeline.fromTo(
            formTitle.current,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
            },
            "-=0.5",
          );

          timeline.fromTo(
            formContainer.current,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
            },
            "-=0.5",
          );
        }
      }
    },
    { scope: container },
  );

  const titleText =
    page?.titleEn?.trim() || contact?.titleEn?.trim() || "Get in Touch";
  const subtitleText =
    page?.contentEn?.trim() ||
    contact?.subtitleEn?.trim() ||
    "We're here to provide the legal support you need. Reach out today to discuss your case or ask any questions.";
  const addressText = contact?.addressEn?.trim() || "123 Justice Avenue, Suite 101\nSpringfield, IL 62704";
  const emailText = contact?.email?.trim() || "info@lawfirm.com";
  const primaryPhone = contact?.phone?.trim() || "(555) 123-4567";
  const secondaryPhone = contact?.secondaryPhone?.trim() || "";

  const [addressLine1, addressLine2] = addressText.split("\n");

  // Extract src URL from a full <iframe ...> string, or use as-is if it's already a URL
  const rawMap = contact?.mapEmbedUrl?.trim() ?? "";
  const mapSrc = rawMap.startsWith("<iframe")
    ? (rawMap.match(/src="([^"]+)"/) ?? [])[1] ?? ""
    : rawMap;

  return (
    <section ref={container} className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.content}>
          <div className={styles.title_wrapper}>
            <h3 ref={title} className={cn("heading-3", styles.title)}>
              {titleText}
            </h3>
            <p
              ref={description}
              className={cn("paragraph-x-large", styles.description)}
            >
              {subtitleText}
            </p>
          </div>

          <div ref={divider} className={styles.divider} />

          <div className={styles.details_wrapper}>
            <div>
              <div
                ref={(el) => {
                  detailsTitles.current[0] = el;
                }}
                className={cn("paragraph-x-large", styles.details_title)}
              >
                Headquarters
              </div>
              <p
                ref={(el) => {
                  detailsTexts.current[0] = el;
                }}
                className={cn("paragraph-medium", styles.details_text)}
              >
                {addressLine1}
              </p>
              <p
                ref={(el) => {
                  detailsTexts.current[1] = el;
                }}
                className={cn("paragraph-medium", styles.details_text)}
              >
                {addressLine2}
              </p>
            </div>

            <div>
              <div
                ref={(el) => {
                  detailsTitles.current[1] = el;
                }}
                className={cn("paragraph-x-large", styles.details_title)}
              >
                Contacts
              </div>
              <p
                ref={(el) => {
                  detailsTexts.current[2] = el;
                }}
                className={cn("paragraph-medium", styles.details_text)}
              >
                {emailText}
              </p>
              <p
                ref={(el) => {
                  detailsTexts.current[3] = el;
                }}
                className={cn("paragraph-medium", styles.details_text)}
              >
                {primaryPhone}
              </p>
              {secondaryPhone && (
                <p className={cn("paragraph-medium", styles.details_text)}>
                  {secondaryPhone}
                </p>
              )}
            </div>
          </div>
        </div>

        <div ref={image} className={styles.image_wrapper}>
          {mapSrc ? (
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <Image
              src="/images/contact.jpg"
              alt="AG Legal"
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>

        <div ref={formTitle} className={cn("heading-3", styles.form_title)}>
          {"We're here to help you."}
        </div>

        <div ref={formContainer}>
          <ContactForm className={styles.contact_form} />
        </div>
      </div>
    </section>
  );
};

export default Hero;

"use client";

import React, { useEffect, useRef } from "react";
import cn from "classnames";
import styles from "./menu.module.css";
import icons from "@/constants/icons";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

type MenuProps = {
  menuOpen: boolean;
  handleMenu: () => void;
};

const Menu = ({ menuOpen, handleMenu }: MenuProps) => {
  const { t } = useLanguage();
  const { nav_links } = t;
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  /* Body scroll lock when menu open (Figma 8329-3603) */
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  return (
    <div
      className={cn(styles.menu, { [styles.menu_active]: menuOpen })}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      aria-hidden={!menuOpen}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={handleMenu}
        className={styles.close_button}
        aria-label="Close menu"
      >
        {icons.Close}
      </button>

      <nav className={styles.nav_links} aria-label="Main navigation">
        {nav_links.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            className={styles.nav_link}
            onClick={handleMenu}
          >
            {link.title}
          </Link>
        ))}
      </nav>

      <p className={styles.footer_title}>{t.ui.header.followUs}</p>

      <div className={styles.socials} role="list">
        {t.socials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noreferrer noopener"
            className={styles.social}
            aria-label={social.title}
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Menu;

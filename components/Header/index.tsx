"use client";

import React from "react";
import cn from "classnames";
import styles from "./header.module.css";
import Logo from "../Logo";
import Menu from "./Menu";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavVisibility } from "@/contexts/NavVisibilityContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { locale, setLocale, t } = useLanguage();
  const { hiddenNavIds } = useNavVisibility();
  const visibleNavLinks = t.nav_links.filter((l) => !hiddenNavIds.includes(l.id));

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={cn("container", styles.container)}>
        <Logo iconOnly />

        <nav className={styles.inline_nav} aria-label="Main navigation">
          {visibleNavLinks.map((link) => (
            <Link key={link.id} href={link.url} className={styles.inline_nav_link}>
              {link.title}
            </Link>
          ))}
        </nav>

        <div className={styles.btn_wrapper}>
          <button
            type="button"
            className={cn(styles.button_outline, styles.lang_toggle)}
            onClick={() => setLocale(locale === "en" ? "ka" : "en")}
            aria-label={locale === "en" ? "Switch to Georgian" : "Switch to English"}
          >
            {locale === "en" ? "ქარ" : "EN"}
          </button>
          <Link href="/contact" className={cn(styles.button_secondary)}>
            {t.ui.header.contact}
          </Link>

          <div className={styles.hamburger} aria-expanded={menuOpen}>
            <input
              type="checkbox"
              className={styles.checkbox}
              id="hamburger-checkbox"
              checked={menuOpen}
              onChange={handleMenu}
              aria-label="Toggle menu"
            />
            <div>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div
          onClick={handleMenu}
          className={cn(styles.overlay, { [styles.overlay_active]: menuOpen })}
        />

        <Menu menuOpen={menuOpen} handleMenu={handleMenu} visibleNavLinks={visibleNavLinks} />
      </div>
    </header>
  );
};

export default Header;

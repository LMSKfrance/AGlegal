"use client";

import React from "react";
import cn from "classnames";
import styles from "./header.module.css";
import Logo from "../Logo";
import Menu from "./Menu";
import Link from "next/link";

const Header = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={cn("container", styles.container)}>
        <Logo iconOnly />

        <div className={styles.btn_wrapper}>
          <Link href="/" className={cn(styles.button_outline)} aria-label="Language">
            EN
          </Link>
          <Link href="/contact" className={cn(styles.button_secondary)}>
            Contact us
          </Link>

          <div onClick={handleMenu} className={styles.hamburger}>
            <input
              type="checkbox"
              className={styles.checkbox}
              id="hamburger-checkbox"
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

        <Menu menuOpen={menuOpen} handleMenu={handleMenu} />
      </div>
    </header>
  );
};

export default Header;

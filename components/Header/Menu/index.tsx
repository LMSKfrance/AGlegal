import React from "react";
import cn from "classnames";
import styles from "./menu.module.css";
import icons from "@/constants/icons";
import Link from "next/link";
import mock from "@/constants/mock";

type MenuProps = {
  menuOpen: boolean;
  handleMenu: () => void;
};

const Menu = ({ menuOpen, handleMenu }: MenuProps) => {
  const { nav_links } = mock;

  return (
    <div className={cn(styles.menu, { [styles.menu_active]: menuOpen })}>
      <button onClick={handleMenu} className={styles.close_button}>
        {icons.Close}
      </button>

      <div className={cn("subheading-small", styles.menu_title)}>Menu</div>

      <div className={styles.nav_links}>
        {nav_links.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            className={cn("heading-6", styles.nav_link)}
          >
            {link.title}
          </Link>
        ))}
      </div>

      <div className={cn("subheading-small", styles.footer_title)}>
        Follow us
      </div>

      <div className={styles.socials}>
        {mock.socials.map((social) => (
          <a key={social.id} href={social.url} className={cn(styles.social)}>
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Menu;

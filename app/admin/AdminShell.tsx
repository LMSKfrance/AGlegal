"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/design-system";
import Logo from "@/components/Logo";
import styles from "./admin.module.css";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/contact", label: "Contact" },
];

export default function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <Logo iconOnly variant="header" href="/admin" />
        </div>
        <nav className={styles.sidebarNav} aria-label="Admin navigation">
          {navItems.map(({ href, label }) => {
            const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className={styles.main}>
        <header className={styles.header}>
          <span className={styles.headerLogo}>
            <Logo iconOnly variant="header" href="/" />
          </span>
          <div className={styles.headerRight}>
            {userEmail && <span className={styles.userEmail}>{userEmail}</span>}
            <Button href="/api/auth/signout?callbackUrl=/admin/login" variant="ghost" size="s">
              Sign out
            </Button>
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}

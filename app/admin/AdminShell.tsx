"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import styles from "./admin.module.css";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/home", label: "Homepage" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/history", label: "History" },
];

const SECTION_LABELS: Record<string, string> = {
  home: "Homepage",
  news: "News",
  team: "Team",
  services: "Services",
  pages: "Pages",
  about: "About",
  contact: "Contact",
  history: "History",
};

const navIcons: Record<string, React.ReactNode> = {
  "/admin": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  "/admin/home": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12L12 3l9 9" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  "/admin/news": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  ),
  "/admin/team": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <path d="M16 3.13a4 4 0 010 7.75" />
      <path d="M21 21v-2a4 4 0 00-3-3.87" />
    </svg>
  ),
  "/admin/services": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  "/admin/pages": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  ),
  "/admin/about": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
  "/admin/contact": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  "/admin/history": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  ),
};

function SignOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

type Crumb = { label: string; href?: string };

function getBreadcrumbs(pathname: string): Crumb[] {
  const parts = pathname.split("/").filter(Boolean); // ["admin", "team", "123", "edit"]
  if (parts.length <= 1) return [{ label: "Dashboard" }];

  const section = parts[1];
  const sectionLabel = SECTION_LABELS[section] ?? section;
  const sectionHref = `/admin/${section}`;

  const crumbs: Crumb[] = [{ label: "Dashboard", href: "/admin" }];

  if (parts.length === 2) {
    crumbs.push({ label: sectionLabel });
  } else {
    crumbs.push({ label: sectionLabel, href: sectionHref });
    const sub = parts[2];
    if (sub === "new") {
      crumbs.push({ label: "New" });
    } else if (parts[3] === "edit") {
      crumbs.push({ label: "Edit" });
    } else {
      crumbs.push({ label: sub });
    }
  }

  return crumbs;
}

function AdminTopbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = searchParams.get("toast");

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [toast, pathname]);

  const crumbs = getBreadcrumbs(pathname);

  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <span key={i} className={styles.breadcrumbItem}>
            {i > 0 && <span className={styles.breadcrumbSep}>/</span>}
            {c.href ? (
              <Link href={c.href} className={styles.breadcrumbLink}>{c.label}</Link>
            ) : (
              <span className={styles.breadcrumbCurrent}>{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      {visible && toast && (
        <div className={`${styles.topbarToast} ${toast === "success" ? styles.topbarToastSuccess : styles.topbarToastError}`}>
          {toast === "success" ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          )}
          {toast === "success" ? "Saved successfully" : "Something went wrong"}
        </div>
      )}
    </header>
  );
}

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

  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : "A";

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
                <span className={styles.navIcon}>{navIcons[href]}</span>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className={styles.sidebarBottom}>
          <div className={styles.sidebarUser}>
            <div className={styles.sidebarUserAvatar}>{initial}</div>
            <div className={styles.sidebarUserInfo}>
              <span className={styles.sidebarUserEmail}>{userEmail ?? "Admin"}</span>
              <span className={styles.sidebarUserRole}>Administrator</span>
            </div>
            <a
              href="/api/auth/signout?callbackUrl=/admin/login"
              className={styles.sidebarSignOut}
              title="Sign out"
              aria-label="Sign out"
            >
              <SignOutIcon />
            </a>
          </div>
        </div>
      </aside>
      <main className={styles.main}>
        <AdminTopbar />
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}

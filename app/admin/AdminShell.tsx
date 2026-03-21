"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useLang, type Lang } from "./LangContext";
import styles from "./admin.module.css";

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
function IconNews() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /><path d="M8 9h8M8 13h5" />
    </svg>
  );
}
function IconTeam() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <path d="M16 3.13a4 4 0 010 7.75" /><path d="M21 21v-2a4 4 0 00-3-3.87" />
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  );
}
function IconPages() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
    </svg>
  );
}
function IconContact() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2z" />
      <path d="M12 18h.01M8 6h8M8 10h8M8 14h4" />
    </svg>
  );
}
function IconHistory() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.12" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function IconBellHeader() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function IconScales() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M5 21h14" /><path d="M7 3h10" />
      <path d="M5 9l-2 6h4L5 9z" /><path d="M19 9l-2 6h4l-2-6z" />
    </svg>
  );
}
function IconSignOut() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

// ─── Nav structure ────────────────────────────────────────────────────────────

const navStructure = [
  {
    label: "Platform",
    items: [
      { href: "/admin", label: "Dashboard", Icon: IconDashboard },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/home", label: "Homepage", Icon: IconHome },
      { href: "/admin/news", label: "News", Icon: IconNews },
      { href: "/admin/team", label: "Team", Icon: IconTeam },
      { href: "/admin/services", label: "Services", Icon: IconBriefcase },
      { href: "/admin/pages", label: "Pages", Icon: IconPages },
      { href: "/admin/about", label: "About", Icon: IconInfo },
      { href: "/admin/contact", label: "Contact", Icon: IconContact },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/history", label: "History Log", Icon: IconHistory },
      { href: "/admin/notifications", label: "Tasks & Notifications", Icon: IconBell, badge: "4" },
    ],
  },
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
  profile: "My Profile",
  notifications: "Tasks & Notifications",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

type Crumb = { label: string; href?: string };

function getBreadcrumbs(pathname: string): Crumb[] {
  const parts = pathname.split("/").filter(Boolean);
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
    if (sub === "new") crumbs.push({ label: "New" });
    else if (parts[3] === "edit") crumbs.push({ label: "Edit" });
    else crumbs.push({ label: sub });
  }
  return crumbs;
}

// ─── Lang Switcher ────────────────────────────────────────────────────────────

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const options: { value: Lang; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "ka", label: "KA" },
  ];
  return (
    <div className={styles.langSwitcher}>
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={`${styles.langSwitcherBtn} ${lang === value ? styles.langSwitcherActive : ""}`}
          onClick={() => setLang(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Topbar Toast ─────────────────────────────────────────────────────────────

function TopbarToast() {
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

  if (!visible || !toast) return null;

  return (
    <div className={`${styles.topbarToast} ${toast === "success" ? styles.topbarToastSuccess : styles.topbarToastError}`}>
      {toast === "success" ? "✓ Saved successfully" : "✕ Something went wrong"}
    </div>
  );
}

// ─── Admin Shell ──────────────────────────────────────────────────────────────

export default function AdminShell({
  children,
  userEmail,
  userName,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
  userName?: string | null;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isLogin = pathname === "/admin/login";

  if (isLogin) return <>{children}</>;

  const displayName = userName ?? "Admin";
  const initials = getInitials(displayName);
  const crumbs = getBreadcrumbs(pathname);

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
        {/* Logo row */}
        <div className={styles.sidebarLogoRow}>
          <Link href="/admin" className={styles.sidebarLogoLink}>
            <span className={styles.sidebarLogoIcon}><IconScales /></span>
            {!collapsed && <span className={styles.sidebarLogoText}>AG Legal</span>}
          </Link>
          <button
            type="button"
            className={styles.sidebarToggleBtn}
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconMenu />
          </button>
        </div>

        {/* Nav */}
        <nav className={styles.sidebarNav} aria-label="Admin navigation">
          {navStructure.map((section) => (
            <div key={section.label} className={styles.navGroup}>
              {!collapsed && (
                <div className={styles.navGroupLabel}>{section.label}</div>
              )}
              {section.items.map(({ href, label, Icon, badge }) => {
                const isActive =
                  href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(href);
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                    title={label}
                  >
                    <span className={styles.navIcon}><Icon /></span>
                    {!collapsed && <span>{label}</span>}
                    {!collapsed && badge ? (
                      <span className={styles.navBadge}>{badge}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User area */}
        <div className={styles.sidebarBottom}>
          <div className={styles.sidebarUserGroup}>
            <Link
              href="/admin/profile"
              className={`${styles.sidebarUserLink} ${pathname === "/admin/profile" ? styles.sidebarUserActive : ""}`}
            >
              <div className={styles.sidebarUserAvatar}>{initials}</div>
              {!collapsed && (
                <div className={styles.sidebarUserInfo}>
                  <span className={styles.sidebarUserName}>{displayName}</span>
                  <span className={styles.sidebarUserRole}>{userEmail ?? "Administrator"}</span>
                </div>
              )}
            </Link>
            {!collapsed && (
              <div className={styles.sidebarUserPopup}>
                <div className={styles.sidebarUserPopupHeader}>
                  <div className={styles.sidebarUserPopupName}>{displayName}</div>
                  <div className={styles.sidebarUserPopupEmail}>{userEmail}</div>
                </div>
                <div className={styles.sidebarUserPopupBody}>
                  <Link href="/admin/profile" className={styles.sidebarUserPopupItem}>
                    <IconUser /> My Profile
                  </Link>
                  <form method="post" action="/api/auth/signout">
                    <input type="hidden" name="callbackUrl" value="/admin/login" />
                    <button type="submit" className={`${styles.sidebarUserPopupItem} ${styles.sidebarUserPopupSignOut}`}>
                      <IconSignOut /> Sign Out
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <span className={styles.breadcrumbDimmed}>Admin</span>
            {crumbs.map((c, i) => (
              <span key={i} className={styles.breadcrumbItem}>
                <span className={styles.breadcrumbSep} aria-hidden="true" />
                {c.href ? (
                  <Link href={c.href} className={styles.breadcrumbLink}>{c.label}</Link>
                ) : (
                  <span className={styles.breadcrumbCurrent}>{c.label}</span>
                )}
              </span>
            ))}
          </nav>

          <div className={styles.topbarRight}>
            <Link href="/admin/notifications" className={styles.bellBtn} aria-label="Notifications">
              <IconBellHeader />
              <span className={styles.bellDot} aria-hidden="true" />
            </Link>
            <div className={styles.headerDivider} />
            <LangSwitcher />
            <Suspense fallback={null}>
              <TopbarToast />
            </Suspense>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

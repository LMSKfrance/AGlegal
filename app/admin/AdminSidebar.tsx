"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { AdminLangContext } from "./AdminLangContext";

const nav = [
  {
    group: "Platform",
    items: [
      { href: "/admin", label: "Dashboard", view: "dashboard", icon: "ph-squares-four" },
    ],
  },
  {
    group: "Content",
    items: [
      { href: "/admin/home",     label: "Homepage", view: "home",     icon: "ph-browser" },
      { href: "/admin/news",     label: "News",     view: "news",     icon: "ph-newspaper" },
      { href: "/admin/team",     label: "Team",     view: "team",     icon: "ph-users" },
      { href: "/admin/services", label: "Services", view: "services", icon: "ph-briefcase" },
      { href: "/admin/pages",    label: "Pages",    view: "pages",    icon: "ph-files" },
      { href: "/admin/about",    label: "About",    view: "about",    icon: "ph-info" },
      { href: "/admin/contact",  label: "Contact",  view: "contact",  icon: "ph-address-book" },
    ],
  },
  {
    group: "System",
    items: [
      { href: "/admin/navigation",    label: "Navigation",            view: "navigation",    icon: "ph-navigation-arrow" },
      { href: "/admin/history",       label: "History Log",           view: "history",       icon: "ph-clock-counter-clockwise" },
      { href: "/admin/notifications", label: "Tasks & Notifications", view: "notifications", icon: "ph-bell" },
      { href: "/admin/settings",      label: "Site Settings",         view: "settings",      icon: "ph-gear" },
    ],
  },
];

const LABELS: Record<string, string> = {
  "/admin":               "Dashboard",
  "/admin/home":          "Homepage",
  "/admin/news":          "News",
  "/admin/team":          "Team",
  "/admin/services":      "Services",
  "/admin/pages":         "Pages",
  "/admin/about":         "About",
  "/admin/contact":       "Contact",
  "/admin/navigation":    "Navigation",
  "/admin/history":       "History Log",
  "/admin/notifications": "Tasks & Notifications",
  "/admin/settings":      "Site Settings",
  "/admin/profile":       "My Profile",
};

function getBreadcrumb(pathname: string) {
  if (LABELS[pathname]) return LABELS[pathname];
  const seg = pathname.split("/").filter(Boolean);
  return LABELS[`/admin/${seg[1]}`] ?? "Admin";
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

export default function AdminShell({
  userName,
  userEmail,
  notificationCount,
  siteOnline,
  children,
}: {
  userName: string | null;
  userEmail: string | null;
  notificationCount: number;
  siteOnline: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // SSR: start collapsed to avoid hydration mismatch; expand on desktop after mount
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "ka">("en");

  useEffect(() => {
    if (window.innerWidth >= 768) setCollapsed(false);
    try {
      const stored = localStorage.getItem("admin-lang") as "en" | "ka" | null;
      if (stored === "en" || stored === "ka") setLang(stored);
    } catch {}
  }, []);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Show labels when expanded (desktop) OR when mobile drawer is open
  const showLabels = !collapsed || mobileOpen;

  const displayName = userName ?? "Admin User";
  const email = userEmail ?? "admin@aglegal.com";
  const initials = getInitials(displayName);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  function handleDesktopToggle() {
    setCollapsed((c) => !c);
  }

  return (
    <div className="admin-shell-root">

      {/* ═══ Mobile backdrop ═══ */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ═══ Sidebar ═══ */}
      <aside
        id="left-sidebar"
        className={[
          collapsed ? "collapsed" : "",
          mobileOpen ? "mobile-open" : "",
        ].filter(Boolean).join(" ")}
      >
        {/* Logo */}
        <div className="sidebar-header h-16 flex items-center px-6 border-b border-brand-200 shrink-0 justify-between">
          <div className="logo-area flex items-center gap-3 text-brand-900 font-semibold tracking-tight text-lg overflow-hidden">
            <img src="/favicon.svg" alt="AG Legal" className="w-6 h-6 shrink-0" />
            <span className="logo-text truncate">AG Legal</span>
          </div>
          {/* Desktop: collapse toggle | Mobile: close drawer (X) */}
          <button
            onClick={handleDesktopToggle}
            className="btn-icon -mr-2 text-brand-400 hover:text-brand-600 sidebar-desktop-toggle"
            aria-label="Toggle sidebar"
          >
            <i className="ph ph-list text-lg" />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="btn-icon -mr-2 text-brand-400 hover:text-brand-600 sidebar-mobile-close"
            aria-label="Close menu"
          >
            <i className="ph ph-x text-lg" />
          </button>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar-nav">
          {nav.map(({ group, items }, gi) => (
            <Fragment key={group}>
              {showLabels && (
                <div className={`section-label text-[10px] font-bold text-brand-400 uppercase tracking-widest px-6 mb-2${gi > 0 ? " mt-6" : ""}`}>
                  {group}
                </div>
              )}
              {items.map(({ href, label, view, icon }) => (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  data-view={view}
                  className={`nav-item${isActive(href) ? " active" : ""}`}
                >
                  <i className={`ph ${icon}`} />
                  {showLabels && <span className="nav-label">{label}</span>}
                  {showLabels && href === "/admin/notifications" && notificationCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {notificationCount}
                    </span>
                  )}
                </Link>
              ))}
            </Fragment>
          ))}
        </nav>

        {/* Lang switcher — mobile drawer only */}
        <div className="sidebar-lang px-4 py-3 border-t border-brand-100">
          <div className="lang-switcher w-full justify-center">
            <div className={`lang-tab flex-1 text-center${lang === "en" ? " active" : ""}`} onClick={() => { setLang("en"); try { localStorage.setItem("admin-lang", "en"); } catch {} }}>ENG</div>
            <div className={`lang-tab lang-tab-ka flex-1 text-center${lang === "ka" ? " active" : ""}`} onClick={() => { setLang("ka"); try { localStorage.setItem("admin-lang", "ka"); } catch {} }}>ქარ</div>
          </div>
        </div>

        {/* Credits */}
        {showLabels && (
          <div className="px-6 pb-3 text-[10px] text-brand-300 leading-relaxed">
            AG Legal Admin 1.0<br />
            Built by{" "}
            <a href="https://sk01.fr" target="_blank" rel="noreferrer" className="text-brand-400 hover:text-primary-600 transition-colors">
              Sandro Kozmanishvili
            </a>{" "}
            · Sk01.fr Studio
          </div>
        )}

        {/* User */}
        <div className="p-4 shrink-0 bg-white">
          <div className="relative group">
          <Link
            href="/admin/profile"
            className="sidebar-user-link flex items-center gap-3 w-full p-2 rounded-lg hover:bg-brand-50 transition-colors cursor-pointer"
            title="Profile"
          >
            <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">
              {initials}
            </div>
            {showLabels && (
              <div className="flex-1 overflow-hidden user-info">
                <div className="text-[13px] font-medium text-brand-900 truncate leading-tight">{displayName}</div>
                <div className="text-[12px] text-brand-500 truncate">{email}</div>
              </div>
            )}
          </Link>

          {showLabels && (
            <div className="absolute bottom-full left-0 mb-1 w-56 bg-white border border-brand-200 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
              <div className="p-3 border-b border-brand-100">
                <div className="text-sm font-semibold text-brand-900">{displayName}</div>
                <div className="text-xs text-brand-500">{email}</div>
              </div>
              <div className="p-1">
                <Link
                  href="/admin/profile"
                  className="w-full text-left px-3 py-2 text-sm text-brand-700 hover:bg-brand-50 rounded-lg flex items-center gap-2"
                >
                  <i className="ph ph-user" /> My Profile
                </Link>
                <form method="post" action="/api/auth/signout">
                  <input type="hidden" name="callbackUrl" value="/admin/login" />
                  <button type="submit" className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                    <i className="ph ph-sign-out" /> Sign Out
                  </button>
                </form>
              </div>
            </div>
          )}
          </div>
        </div>
      </aside>

      {/* ═══ Right area: header + content ═══ */}
      <div className="admin-main">

        {/* Header */}
        <header className="admin-header">
          <div className="flex items-center gap-2">
            {/* Mobile hamburger — opens drawer */}
            <button
              onClick={() => setMobileOpen(true)}
              className="btn-icon mobile-menu-btn text-brand-600"
              aria-label="Open menu"
            >
              <i className="ph ph-list text-[20px]" />
            </button>
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-brand-500">Admin</span>
              <i className="ph ph-caret-right text-brand-300 text-[10px]" />
              <h1 className="text-brand-900 font-medium text-[13px] m-0">{getBreadcrumb(pathname)}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Site status */}
            <Link
              href="/admin/settings"
              title="Site availability — click to manage"
              className={`site-status ${siteOnline ? "online" : "offline"}`}
            >
              <span className="site-status-dot" />
              <span className="site-status-label">{siteOnline ? "Online" : "Offline"}</span>
            </Link>

            <Link href="/admin/notifications" className="btn-icon relative" title="Notifications">
              <i className="ph ph-bell text-[20px]" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1.5 w-[8px] h-[8px] bg-red-500 rounded-full border border-white" />
              )}
            </Link>
            <div className="hidden md:block w-px h-5 bg-brand-200" />
            <div className="hidden md:flex lang-switcher">
              <div className={`lang-tab${lang === "en" ? " active" : ""}`} onClick={() => { setLang("en"); try { localStorage.setItem("admin-lang", "en"); } catch {} }}>ENG</div>
              <div className={`lang-tab lang-tab-ka${lang === "ka" ? " active" : ""}`} onClick={() => { setLang("ka"); try { localStorage.setItem("admin-lang", "ka"); } catch {} }}>ქარ</div>
            </div>
          </div>
        </header>

        {/* Offline notice */}
        {!siteOnline && (
          <div className="offline-notice">
            <span className="offline-notice-text">
              <strong>Website is offline</strong> · visitors are seeing the maintenance page
            </span>
            <Link href="/admin/settings" className="offline-notice-action">
              Settings <i className="ph ph-arrow-right" />
            </Link>
          </div>
        )}

        {/* Page content */}
        <main className="admin-content">
          <AdminLangContext.Provider value={lang}>
            {children}
          </AdminLangContext.Provider>
        </main>
      </div>
    </div>
  );
}

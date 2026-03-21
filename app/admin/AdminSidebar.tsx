"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

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
      { href: "/admin/history",       label: "History Log",           view: "history",       icon: "ph-clock-counter-clockwise" },
      { href: "/admin/notifications", label: "Tasks & Notifications", view: "notifications", icon: "ph-bell", badge: "4" },
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
  "/admin/history":       "History Log",
  "/admin/notifications": "Tasks & Notifications",
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
  children,
}: {
  userName: string | null;
  userEmail: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // SSR: start collapsed to avoid hydration mismatch; expand on desktop after mount
  const [collapsed, setCollapsed] = useState(true);
  const [lang, setLang] = useState<"en" | "ka">("en");

  useEffect(() => {
    // On mount: expand sidebar on desktop, keep collapsed on mobile
    if (window.innerWidth > 768) setCollapsed(false);
  }, []);

  const displayName = userName ?? "Admin User";
  const email = userEmail ?? "admin@aglegal.com";
  const initials = getInitials(displayName);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="admin-shell-root">

      {/* ═══ Sidebar ═══ */}
      <aside
        id="left-sidebar"
        className={collapsed ? "collapsed" : ""}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-brand-200 shrink-0 justify-between">
          <div className="flex items-center gap-3 text-brand-900 font-semibold tracking-tight text-lg overflow-hidden">
            <i className="ph-fill ph-scales text-primary-600 text-[24px] shrink-0" />
            {!collapsed && <span className="logo-text truncate">AG Legal</span>}
          </div>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="btn-icon -mr-2 text-brand-400 hover:text-brand-600"
          >
            <i className="ph ph-list text-lg" />
          </button>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar-nav">
          {nav.map(({ group, items }, gi) => (
            <Fragment key={group}>
              {!collapsed && (
                <div className={`section-label text-[10px] font-bold text-brand-400 uppercase tracking-widest px-6 mb-2${gi > 0 ? " mt-6" : ""}`}>
                  {group}
                </div>
              )}
              {items.map(({ href, label, view, icon, badge }) => (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  data-view={view}
                  className={`nav-item${isActive(href) ? " active" : ""}`}
                >
                  <i className={`ph ${icon}`} />
                  {!collapsed && <span className="nav-label">{label}</span>}
                  {!collapsed && badge && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {badge}
                    </span>
                  )}
                </Link>
              ))}
            </Fragment>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 shrink-0 bg-white relative group">
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-brand-50 transition-colors cursor-pointer"
            title="Profile"
          >
            <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">
              {initials}
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden user-info">
                <div className="text-[13px] font-medium text-brand-900 truncate leading-tight">{displayName}</div>
                <div className="text-[12px] text-brand-500 truncate">{email}</div>
              </div>
            )}
          </Link>

          {!collapsed && (
            <div className="absolute bottom-full left-4 mb-2 w-56 bg-white border border-brand-200 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
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
      </aside>

      {/* ═══ Right area: header + content ═══ */}
      <div className="admin-main">

        {/* Header */}
        <header className="admin-header">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-brand-500">Admin</span>
            <i className="ph ph-caret-right text-brand-300 text-[10px]" />
            <span className="text-brand-900 font-medium">{getBreadcrumb(pathname)}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/notifications" className="btn-icon relative" title="Notifications">
              <i className="ph ph-bell text-[20px]" />
              <span className="absolute top-1 right-1.5 w-[8px] h-[8px] bg-red-500 rounded-full border border-white" />
            </Link>
            <div className="w-px h-5 bg-brand-200" />
            <div className="lang-switcher">
              <div className={`lang-tab${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}>EN</div>
              <div className={`lang-tab${lang === "ka" ? " active" : ""}`} onClick={() => setLang("ka")}>KA</div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}

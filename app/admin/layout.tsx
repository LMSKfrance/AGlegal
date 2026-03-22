import { auth } from "@/auth";
import Script from "next/script";
import AdminShell from "./AdminSidebar";
import "./admin-shell.css";
import { getNotificationCount } from "@/lib/admin/notifications";
import { getSiteOnlineStatus } from "@/lib/actions/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/admin-favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // When there is no session (e.g. the /admin/login page), render children
  // without the admin shell — no redirect here because:
  //   1. Middleware already redirects unauthenticated requests to /admin/login.
  //   2. app/admin/layout.tsx wraps /admin/login too, so redirecting here
  //      would cause an infinite redirect loop (ERR_TOO_MANY_REDIRECTS).
  if (!session?.user) {
    return <>{children}</>;
  }

  const [notificationCount, siteOnline] = await Promise.all([
    getNotificationCount(),
    getSiteOnlineStatus(),
  ]);

  return (
    <>
      <Script src="https://unpkg.com/@phosphor-icons/web" strategy="beforeInteractive" />
      <AdminShell
        userName={session.user.name ?? null}
        userEmail={session.user.email ?? null}
        notificationCount={notificationCount}
        siteOnline={siteOnline}
      >
        {children}
      </AdminShell>
    </>
  );
}


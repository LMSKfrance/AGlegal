import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Script from "next/script";
import AdminShell from "./AdminSidebar";
import "./admin-shell.css";
import { getNotificationCount } from "@/lib/admin/notifications";
import { getSiteOnlineStatus } from "@/lib/actions/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AG Legal Admin",
  description: "Secure Login",
  openGraph: {
    title: "AG Legal Admin",
    description: "Secure Login",
  },
  icons: {
    icon: [
      { url: "/admin-favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    // Allow /admin/login to render without redirect (would cause loop otherwise).
    const pathname = (await headers()).get("x-pathname") ?? "";
    if (!pathname.startsWith("/admin/login")) {
      redirect("/admin/login");
    }
    return <>{children}</>;
  }

  const [notificationCount, siteOnline] = await Promise.all([
    getNotificationCount().catch(() => 0),
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


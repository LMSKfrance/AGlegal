import { auth } from "@/auth";
import Script from "next/script";
import AdminShell from "./AdminSidebar";
import "./admin-shell.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Login page (and any other unauthenticated route) — no shell, no redirect.
  // The middleware's authorized() callback already redirects /admin/* → /admin/login
  // when unauthenticated, so we never hit a loop here.
  if (!session?.user) {
    return (
      <>
        <Script src="https://unpkg.com/@phosphor-icons/web" strategy="beforeInteractive" />
        {children}
      </>
    );
  }

  return (
    <>
      <Script src="https://unpkg.com/@phosphor-icons/web" strategy="beforeInteractive" />
      <AdminShell
        userName={session.user.name ?? null}
        userEmail={session.user.email ?? null}
      >
        {children}
      </AdminShell>
    </>
  );
}

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Script from "next/script";
import AdminShell from "./AdminSidebar";
import "./admin-shell.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

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

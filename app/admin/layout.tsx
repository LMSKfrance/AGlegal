import { auth } from "@/auth";
import AdminShell from "./AdminShell";
import "./figma-ds.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <div data-figma-ds="admin">
      <AdminShell userEmail={session?.user?.email ?? null}>
        {children}
      </AdminShell>
    </div>
  );
}

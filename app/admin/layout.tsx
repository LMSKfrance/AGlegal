import { auth } from "@/auth";
import AdminShell from "./AdminShell";
import { LangProvider } from "./LangContext";
import "./figma-ds.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <div data-figma-ds="admin">
      <LangProvider>
        <AdminShell userEmail={session?.user?.email ?? null}>
          {children}
        </AdminShell>
      </LangProvider>
    </div>
  );
}

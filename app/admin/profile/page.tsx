import { auth } from "@/auth";
import { updateAdminProfile } from "@/lib/actions/adminProfile";
import ProfileForm from "./ProfileForm";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

export default async function ProfilePage() {
  const session = await auth();
  const name = session?.user?.name ?? "Admin User";
  const email = session?.user?.email ?? "";
  const initials = getInitials(name);

  const currentPassword = process.env.ADMIN_PASSWORD ?? "";

  return (
    <>
      <div className="pb-6 pt-8 border-b border-brand-200 px-8">
        <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Admin Profile</h1>
        <p className="text-brand-500 mt-2">Manage your account settings and password.</p>
      </div>

      <ProfileForm
        name={name}
        email={email}
        initials={initials}
        currentPassword={currentPassword}
        action={updateAdminProfile}
      />
    </>
  );
}

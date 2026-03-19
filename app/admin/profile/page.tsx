import styles from "../admin.module.css";
import { getAdminProfile } from "@/lib/actions/adminProfile";
import { ProfileForm } from "./ProfileForm";

export default async function AdminProfilePage() {
  let profile = null;
  try {
    profile = await getAdminProfile();
  } catch {}

  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>My Profile</h1>
      </div>
      <ProfileForm
        name={profile?.name ?? "Admin"}
        email={profile?.email ?? ""}
      />
    </>
  );
}

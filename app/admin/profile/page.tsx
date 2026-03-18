import styles from "../admin.module.css";
import { getAdminProfile } from "@/lib/actions/adminProfile";
import { ProfileForm } from "./ProfileForm";

export default async function AdminProfilePage() {
  const profile = await getAdminProfile();

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

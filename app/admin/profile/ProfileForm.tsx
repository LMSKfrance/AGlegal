"use client";

import { useActionState } from "react";
import { TextField } from "@/design-system";
import { updateAdminProfile, type ProfileFormState } from "@/lib/actions/adminProfile";
import { SubmitButton } from "../components/SubmitButton";
import styles from "../admin.module.css";

type Props = {
  name: string;
  email: string;
};

const initialState: ProfileFormState = {};

export function ProfileForm({ name, email }: Props) {
  const [state, formAction] = useActionState(updateAdminProfile, initialState);

  return (
    <form action={formAction} className={styles.formCard}>
      <div className={styles.formRow}>
        <TextField label="Name" name="name" defaultValue={name} size="m" required />
      </div>
      <div className={styles.formRow}>
        <TextField label="Email" name="email" type="email" defaultValue={email} size="m" required />
      </div>

      <div className={styles.formSectionDivider} />

      <div className={styles.formRow}>
        <TextField
          label="Current password"
          name="currentPassword"
          type="password"
          size="m"
          required
        />
      </div>
      <div className={styles.formRow}>
        <TextField
          label="New password"
          name="newPassword"
          type="password"
          size="m"
          hint="Leave blank to keep current password"
        />
      </div>
      <div className={styles.formRow}>
        <TextField
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          size="m"
        />
      </div>

      {state.error && (
        <div className={styles.formError}>{state.error}</div>
      )}
      {state.success && (
        <div className={styles.formSuccess}>Profile updated successfully.</div>
      )}

      <div className={styles.formRow} style={{ marginTop: 8 }}>
        <SubmitButton label="Update profile" />
      </div>
    </form>
  );
}

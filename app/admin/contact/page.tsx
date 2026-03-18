import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Button, TextField, TextArea } from "@/design-system";
import { AdminLangTabs } from "../components/AdminLangTabs";
import { AdminToast } from "../components/AdminToast";
import styles from "../admin.module.css";
import { getContactSettings, upsertContactSettings } from "@/lib/actions/contact";
import { SubmitButton } from "../components/SubmitButton";

export default async function AdminContactPage() {
  const contact = await getContactSettings();

  async function action(formData: FormData) {
    "use server";
    const result = await upsertContactSettings({}, formData);
    if (result.success) redirect("/admin/contact?toast=success");
  }

  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Contact page content</h1>
      </div>
      <form action={action} className={styles.formCard}>
        <AdminLangTabs
          childrenEn={
            <div className={styles.formRow}>
              <TextField
                label="Title (EN)"
                name="titleEn"
                defaultValue={contact?.titleEn ?? ""}
                size="m"
              />
              <div style={{ marginTop: 16 }}>
                <TextArea
                  label="Subtitle (EN)"
                  name="subtitleEn"
                  rows={2}
                  defaultValue={contact?.subtitleEn ?? ""}
                  size="m"
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <TextArea
                  label="Address (EN)"
                  name="addressEn"
                  rows={3}
                  defaultValue={contact?.addressEn ?? ""}
                  size="m"
                />
              </div>
            </div>
          }
          childrenKa={
            <div className={styles.formRow}>
              <TextField
                label="Title (KA)"
                name="titleKa"
                defaultValue={contact?.titleKa ?? ""}
                size="m"
              />
              <div style={{ marginTop: 16 }}>
                <TextArea
                  label="Subtitle (KA)"
                  name="subtitleKa"
                  rows={2}
                  defaultValue={contact?.subtitleKa ?? ""}
                  size="m"
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <TextArea
                  label="Address (KA)"
                  name="addressKa"
                  rows={3}
                  defaultValue={contact?.addressKa ?? ""}
                  size="m"
                />
              </div>
            </div>
          }
        />

        <div className={styles.formRow}>
          <TextField
            label="Email"
            name="email"
            type="email"
            defaultValue={contact?.email ?? ""}
            size="m"
          />
        </div>
        <div className={styles.formRow}>
          <TextField
            label="Phone"
            name="phone"
            defaultValue={contact?.phone ?? ""}
            size="m"
          />
        </div>
        <div className={styles.formRow}>
          <TextField
            label="Secondary phone"
            name="secondaryPhone"
            defaultValue={contact?.secondaryPhone ?? ""}
            size="m"
          />
        </div>

        <div className={styles.formRow}>
          <TextField
            label="Facebook URL"
            name="facebookUrl"
            defaultValue={contact?.facebookUrl ?? ""}
            size="m"
          />
        </div>
        <div className={styles.formRow}>
          <TextField
            label="Instagram URL"
            name="instagramUrl"
            defaultValue={contact?.instagramUrl ?? ""}
            size="m"
          />
        </div>
        <div className={styles.formRow}>
          <TextField
            label="LinkedIn URL"
            name="linkedinUrl"
            defaultValue={contact?.linkedinUrl ?? ""}
            size="m"
          />
        </div>
        <div className={styles.formRow}>
          <TextField
            label="X (Twitter) URL"
            name="xUrl"
            defaultValue={contact?.xUrl ?? ""}
            size="m"
          />
        </div>
        <div className={styles.formRow}>
          <TextArea
            label="Map embed URL or iframe"
            name="mapEmbedUrl"
            rows={3}
            defaultValue={contact?.mapEmbedUrl ?? ""}
            size="m"
          />
        </div>

        <div className={styles.formRow} style={{ marginTop: 24 }}>
          <SubmitButton />
        </div>
      </form>
      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
    </>
  );
}

"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button, TextField, TextArea } from "@/design-system";
import { AdminLangTabs } from "../components/AdminLangTabs";
import type { Service } from "@/lib/db/schema";
import { createService, updateService } from "@/lib/actions/services";
import styles from "../admin.module.css";

type Props = {
  item?: Service | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" colorStyle="dark" size="m" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </Button>
  );
}

export function ServicesForm({ item }: Props) {
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!item;

  async function handleAction(formData: FormData) {
    setError(null);
    const result = isEdit
      ? await updateService(item.id, {}, formData)
      : await createService({}, formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.success) {
      window.location.href = "/admin/services?toast=success";
    }
  }

  return (
    <form action={handleAction} className={styles.formCard}>
      {error && <div className={styles.formError} role="alert">{error}</div>}

      <div className={styles.formRow}>
        <label style={{ display: "block", marginBottom: 8 }}>Image</label>
        <input type="file" name="image" accept="image/jpeg,image/png,image/gif,image/webp" />
        {item?.image && (
          <p style={{ marginTop: 8, fontSize: 14, color: "var(--gray-600)" }}>
            Current: <a href={item.image} target="_blank" rel="noreferrer">{item.image}</a>
          </p>
        )}
      </div>
      <div className={styles.formRow}>
        <label style={{ display: "block", marginBottom: 8 }}>Thumbnail image</label>
        <input type="file" name="thumbnailImage" accept="image/jpeg,image/png,image/gif,image/webp" />
        {item?.thumbnailImage && (
          <p style={{ marginTop: 8, fontSize: 14, color: "var(--gray-600)" }}>
            Current: <a href={item.thumbnailImage} target="_blank" rel="noreferrer">{item.thumbnailImage}</a>
          </p>
        )}
      </div>

      <div className={styles.formRow}>
        <label style={{ display: "block", marginBottom: 4 }}>
          <input
            type="checkbox"
            name="showOnHome"
            defaultChecked={item?.showOnHome === 1}
            style={{ marginRight: 8 }}
          />
          Show in homepage &quot;Our legal services&quot; section
        </label>
      </div>

      <div className={styles.formRow}>
        <TextField
          label="Home card order"
          name="homeOrder"
          type="number"
          min={0}
          defaultValue={String(item?.homeOrder ?? 0)}
          size="m"
        />
      </div>

      <div className={styles.formRow}>
        <TextArea
          label="Home short description (EN, optional)"
          name="homeShortDescriptionEn"
          rows={2}
          defaultValue={item?.homeShortDescriptionEn ?? ""}
          size="m"
        />
      </div>

      <div className={styles.formRow}>
        <TextArea
          label="Home short description (KA, optional)"
          name="homeShortDescriptionKa"
          rows={2}
          defaultValue={item?.homeShortDescriptionKa ?? ""}
          size="m"
        />
      </div>

      <div className={styles.formRow}>
        <TextField
          label='Custom "Learn more" URL (optional)'
          name="homeLearnMoreUrl"
          defaultValue={item?.homeLearnMoreUrl ?? ""}
          size="m"
          placeholder="/services or full URL"
        />
      </div>

      <div className={styles.formRow}>
        <label style={{ display: "block", marginBottom: 8 }}>Home card image (optional)</label>
        <input type="file" name="homeCardImage" accept="image/jpeg,image/png,image/gif,image/webp" />
        {item?.homeCardImage && (
          <p style={{ marginTop: 8, fontSize: 14, color: "var(--gray-600)" }}>
            Current: <a href={item.homeCardImage} target="_blank" rel="noreferrer">{item.homeCardImage}</a>
          </p>
        )}
      </div>

      <AdminLangTabs
        childrenEn={
          <div className={styles.formRow}>
            <TextField label="Title (EN) *" name="titleEn" required defaultValue={item?.titleEn ?? ""} size="m" />
            <div style={{ marginTop: 16 }}>
              <TextArea label="Description (EN)" name="descriptionEn" rows={3} defaultValue={item?.descriptionEn ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Text 1 (EN)" name="text1En" rows={3} defaultValue={item?.text1En ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Text 2 (EN)" name="text2En" rows={3} defaultValue={item?.text2En ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Quote (EN)" name="quoteEn" rows={2} defaultValue={item?.quoteEn ?? ""} size="m" />
            </div>
          </div>
        }
        childrenKa={
          <div className={styles.formRow}>
            <TextField label="Title (KA)" name="titleKa" defaultValue={item?.titleKa ?? ""} size="m" />
            <div style={{ marginTop: 16 }}>
              <TextArea label="Description (KA)" name="descriptionKa" rows={3} defaultValue={item?.descriptionKa ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Text 1 (KA)" name="text1Ka" rows={3} defaultValue={item?.text1Ka ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Text 2 (KA)" name="text2Ka" rows={3} defaultValue={item?.text2Ka ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Quote (KA)" name="quoteKa" rows={2} defaultValue={item?.quoteKa ?? ""} size="m" />
            </div>
          </div>
        }
      />

      <div className={styles.formRow} style={{ marginTop: 24 }}>
        <SubmitButton />
      </div>
    </form>
  );
}

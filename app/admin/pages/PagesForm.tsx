"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button, TextField, TextArea } from "@/design-system";
import { AdminLangTabs } from "../components/AdminLangTabs";
import type { Page } from "@/lib/db/schema";
import { createPage, updatePage } from "@/lib/actions/pages";
import styles from "../admin.module.css";

type Props = {
  item?: Page | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" colorStyle="dark" size="m" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </Button>
  );
}

export function PagesForm({ item }: Props) {
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!item;

  async function handleAction(formData: FormData) {
    setError(null);
    const result = isEdit
      ? await updatePage(item.id, {}, formData)
      : await createPage({}, formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.success) {
      window.location.href = "/admin/pages?toast=success";
    }
  }

  return (
    <form action={handleAction} className={styles.formCard}>
      {error && <div className={styles.formError} role="alert">{error}</div>}

      <div className={styles.formRow}>
        <TextField
          label="Slug (URL path, e.g. about, contact)"
          name="slug"
          required={!isEdit}
          defaultValue={item?.slug ?? ""}
          placeholder="about"
          size="m"
        />
      </div>

      <AdminLangTabs
        childrenEn={
          <div className={styles.formRow}>
            <TextField label="Title (EN) *" name="titleEn" required defaultValue={item?.titleEn ?? ""} size="m" />
            <div style={{ marginTop: 16 }}>
              <TextArea label="Meta description (EN)" name="metaDescriptionEn" rows={2} defaultValue={item?.metaDescriptionEn ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextField label="SEO title (EN)" name="seoTitleEn" defaultValue={item?.seoTitleEn ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextField label="OG title (EN)" name="ogTitleEn" defaultValue={item?.ogTitleEn ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="OG description (EN)" name="ogDescriptionEn" rows={2} defaultValue={item?.ogDescriptionEn ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Content (EN, Markdown)" name="contentEn" rows={12} defaultValue={item?.contentEn ?? ""} size="m" />
            </div>
          </div>
        }
        childrenKa={
          <div className={styles.formRow}>
            <TextField label="Title (KA)" name="titleKa" defaultValue={item?.titleKa ?? ""} size="m" />
            <div style={{ marginTop: 16 }}>
              <TextArea label="Meta description (KA)" name="metaDescriptionKa" rows={2} defaultValue={item?.metaDescriptionKa ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextField label="SEO title (KA)" name="seoTitleKa" defaultValue={item?.seoTitleKa ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextField label="OG title (KA)" name="ogTitleKa" defaultValue={item?.ogTitleKa ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="OG description (KA)" name="ogDescriptionKa" rows={2} defaultValue={item?.ogDescriptionKa ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Content (KA, Markdown)" name="contentKa" rows={12} defaultValue={item?.contentKa ?? ""} size="m" />
            </div>
          </div>
        }
      />

      <div className={styles.formRow}>
        <TextField
          label="OG image URL/path"
          name="ogImage"
          defaultValue={item?.ogImage ?? ""}
          size="m"
        />
      </div>

      <div className={styles.formRow} style={{ marginTop: 24 }}>
        <SubmitButton />
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button, TextField, TextArea } from "@/design-system";
import { AdminLangTabs } from "../components/AdminLangTabs";
import type { Article } from "@/lib/db/schema";
import { createNews, updateNews } from "@/lib/actions/news";
import styles from "../admin.module.css";

type Props = {
  item?: Article | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" colorStyle="dark" size="m" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </Button>
  );
}

export function NewsForm({ item }: Props) {
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!item;

  async function handleAction(formData: FormData) {
    setError(null);
    const result = isEdit
      ? await updateNews(item.id, {}, formData)
      : await createNews({}, formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.success) {
      window.location.href = "/admin/news?toast=success";
    }
  }

  return (
    <form action={handleAction} className={styles.formCard}>
      {error && <div className={styles.formError} role="alert">{error}</div>}

      <div className={styles.formRow}>
        <label className={styles.formRow} style={{ display: "block", marginBottom: 8 }}>
          Image
        </label>
        <input type="file" name="image" accept="image/jpeg,image/png,image/gif,image/webp" />
        {item?.image && (
          <p style={{ marginTop: 8, fontSize: 14, color: "var(--gray-600)" }}>
            Current: <a href={item.image} target="_blank" rel="noreferrer">{item.image}</a>
          </p>
        )}
      </div>

      <div className={styles.formRow}>
        <TextField
          label="Date"
          name="date"
          type="date"
          required
          defaultValue={item?.date ?? ""}
          size="m"
        />
      </div>
      <div className={styles.formRow}>
        <TextField
          label="Time (optional)"
          name="time"
          type="text"
          placeholder="e.g. 14:00"
          defaultValue={item?.time ?? ""}
          size="m"
        />
      </div>
      <div className={styles.formRow}>
        <TextField
          label="Type"
          name="type"
          placeholder="e.g. News, Article"
          defaultValue={item?.type ?? ""}
          size="m"
        />
      </div>
      <div className={styles.formRow}>
        <TextArea
          label="Tags (comma-separated)"
          name="tags"
          rows={2}
          defaultValue={item?.tags?.join(", ") ?? ""}
          placeholder="tag1, tag2"
          size="m"
        />
      </div>

      <AdminLangTabs
        childrenEn={
          <div className={styles.formRow}>
            <TextField
              label="Title (EN) *"
              name="titleEn"
              required
              defaultValue={item?.titleEn ?? ""}
              size="m"
            />
            <div style={{ marginTop: 16 }}>
              <TextArea
                label="Description (EN)"
                name="descriptionEn"
                rows={3}
                defaultValue={item?.descriptionEn ?? ""}
                size="m"
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea
                label="Content (EN, Markdown)"
                name="contentEn"
                rows={10}
                defaultValue={item?.contentEn ?? ""}
                placeholder="Markdown supported"
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
              defaultValue={item?.titleKa ?? ""}
              size="m"
            />
            <div style={{ marginTop: 16 }}>
              <TextArea
                label="Description (KA)"
                name="descriptionKa"
                rows={3}
                defaultValue={item?.descriptionKa ?? ""}
                size="m"
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea
                label="Content (KA, Markdown)"
                name="contentKa"
                rows={10}
                defaultValue={item?.contentKa ?? ""}
                size="m"
              />
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

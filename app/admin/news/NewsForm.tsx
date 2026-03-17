"use client";

import { useActionState } from "react";
import { Button, TextField, TextArea } from "@/design-system";
import { AdminLangTabs } from "../components/AdminLangTabs";
import { FileUploadField } from "../components/FileUploadField";
import type { Article } from "@/lib/db/schema";
import { createNews, updateNews, type NewsFormState } from "@/lib/actions/news";
import styles from "../admin.module.css";

type Props = {
  item?: Article | null;
};

const initialState: NewsFormState = {};

export function NewsForm({ item }: Props) {
  const isEdit = !!item;
  const action: (prevState: NewsFormState, formData: FormData) => Promise<NewsFormState> =
    isEdit && item ? updateNews.bind(null, item.id) : createNews;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const tagsDefault =
    Array.isArray(item?.tags)
      ? item.tags.join(", ")
      : typeof item?.tags === "string"
        ? item.tags
        : "";

  return (
    <form action={formAction} className={styles.formCard}>
      {state?.error && (
        <div className={styles.formError} role="alert">
          {state.error}
        </div>
      )}

      <div className={styles.formRow}>
        <FileUploadField
          name="image"
          accept="image/jpeg,image/png,image/gif,image/webp"
          label="Image"
          currentPath={item?.image}
        />
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
          defaultValue={tagsDefault}
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
        <Button type="submit" variant="primary" colorStyle="dark" size="m" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}

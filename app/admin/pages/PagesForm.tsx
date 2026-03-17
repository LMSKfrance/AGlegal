"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, TextArea } from "@/design-system";
import { AdminLangTabs } from "../components/AdminLangTabs";
import type { Page } from "@/lib/db/schema";
import { createPage, updatePage, type PageFormState } from "@/lib/actions/pages";
import styles from "../admin.module.css";

type Props = {
  item?: Page | null;
};

export function PagesForm({ item }: Props) {
  const router = useRouter();
  const isEdit = !!item;
  const action = isEdit && item ? updatePage.bind(null, item.id) : createPage;
  const [state, formAction, isPending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) router.push("/admin/pages?toast=success");
  }, [state.success, router]);

  const fieldError = (field: string) => state.fieldErrors?.[field];
  const renderFieldError = (field: string) => {
    const error = fieldError(field);
    return error ? <div style={{ fontSize: 13, color: "var(--error-600)", marginTop: 4 }}>{error}</div> : null;
  };

  return (
    <form action={formAction} className={styles.formCard}>
      {state.error && <div className={styles.formError} role="alert">{state.error}</div>}

      {/* Slug */}
      <div className={styles.formGroup}>
        {isEdit ? (
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--gray-700)", marginBottom: 6 }}>Slug (URL path)</p>
            <p style={{ fontSize: 14, color: "var(--gray-900)", fontFamily: "var(--font-inter)", padding: "10px 14px", background: "var(--gray-100)", borderRadius: 8, margin: 0 }}>
              {item.slug}
            </p>
          </div>
        ) : (
          <TextField
            label="Slug (URL path)"
            name="slug"
            required
            defaultValue=""
            placeholder="e.g. about"
            size="m"
          />
        )}
        <p className={styles.fieldHint}>
          The URL path this page lives at. Use lowercase letters, numbers, and hyphens only.
          {isEdit && " Slug cannot be changed after creation."}
        </p>
      </div>

      {/* Content divider */}
      <div className={styles.fieldGroupDivider} style={{ margin: "24px 0" }} />

      {/* Page content */}
      <AdminLangTabs
        childrenEn={
          <div className={styles.formGroup}>
            <div>
              <TextField label="Page title (EN) *" name="titleEn" required defaultValue={item?.titleEn ?? ""} size="m" />
              {renderFieldError("titleEn")}
            </div>
            <TextArea label="Content (EN, Markdown)" name="contentEn" rows={12} defaultValue={item?.contentEn ?? ""} size="m" />
          </div>
        }
        childrenKa={
          <div className={styles.formGroup}>
            <TextField label="Page title (KA)" name="titleKa" defaultValue={item?.titleKa ?? ""} size="m" />
            <TextArea label="Content (KA, Markdown)" name="contentKa" rows={12} defaultValue={item?.contentKa ?? ""} size="m" />
          </div>
        }
      />

      {/* SEO divider */}
      <div className={styles.fieldGroupDivider} style={{ margin: "24px 0 20px" }} />
      <p className={styles.formHelp} style={{ marginBottom: 20 }}>
        SEO &amp; Open Graph — controls how this page appears in search engines and social media previews.
      </p>

      {/* SEO fields */}
      <AdminLangTabs
        childrenEn={
          <div className={styles.formGroup}>
            <TextField label="SEO title (EN)" name="seoTitleEn" defaultValue={item?.seoTitleEn ?? ""} size="m" />
            <TextArea label="Meta description (EN)" name="metaDescriptionEn" rows={2} defaultValue={item?.metaDescriptionEn ?? ""} size="m" />
            <TextField label="OG title (EN)" name="ogTitleEn" defaultValue={item?.ogTitleEn ?? ""} size="m" />
            <TextArea label="OG description (EN)" name="ogDescriptionEn" rows={2} defaultValue={item?.ogDescriptionEn ?? ""} size="m" />
          </div>
        }
        childrenKa={
          <div className={styles.formGroup}>
            <TextField label="SEO title (KA)" name="seoTitleKa" defaultValue={item?.seoTitleKa ?? ""} size="m" />
            <TextArea label="Meta description (KA)" name="metaDescriptionKa" rows={2} defaultValue={item?.metaDescriptionKa ?? ""} size="m" />
            <TextField label="OG title (KA)" name="ogTitleKa" defaultValue={item?.ogTitleKa ?? ""} size="m" />
            <TextArea label="OG description (KA)" name="ogDescriptionKa" rows={2} defaultValue={item?.ogDescriptionKa ?? ""} size="m" />
          </div>
        }
      />

      <div className={styles.formGroup} style={{ marginTop: 16 }}>
        <TextField label="OG image URL / path" name="ogImage" defaultValue={item?.ogImage ?? ""} size="m" />
        <p className={styles.fieldHint}>
          Absolute URL or /uploads/... path. Recommended size: 1200 × 630 px.
        </p>
      </div>

      <div className={styles.formActions}>
        <Button type="submit" variant="primary" colorStyle="dark" size="m" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}

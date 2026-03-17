"use client";

import { useActionState } from "react";
import { Button, TextField, TextArea } from "@/design-system";
import { AdminLangTabs } from "../components/AdminLangTabs";
import { FileUploadField } from "../components/FileUploadField";
import type { Service } from "@/lib/db/schema";
import { createService, updateService, type ServiceFormState } from "@/lib/actions/services";
import styles from "../admin.module.css";

type Props = {
  item?: Service | null;
};

export function ServicesForm({ item }: Props) {
  const isEdit = !!item;
  const action = isEdit && item ? updateService.bind(null, item.id) : createService;
  const [state, formAction, isPending] = useActionState(action, {});

  const fieldError = (field: string) => state.fieldErrors?.[field];
  const renderFieldError = (field: string) => {
    const error = fieldError(field);
    return error ? <div style={{ fontSize: 13, color: "var(--error-600)", marginTop: 4 }}>{error}</div> : null;
  };

  return (
    <form action={formAction} className={styles.formCard}>
      {state.error && <div className={styles.formError} role="alert">{state.error}</div>}

      <div className={styles.formRow}>
        <FileUploadField
          name="image"
          accept="image/jpeg,image/png,image/gif,image/webp"
          label="Image"
          currentPath={item?.image}
        />
      </div>
      <div className={styles.formRow}>
        <FileUploadField
          name="thumbnailImage"
          accept="image/jpeg,image/png,image/gif,image/webp"
          label="Thumbnail image"
          currentPath={item?.thumbnailImage}
        />
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
        <FileUploadField
          name="homeCardImage"
          accept="image/jpeg,image/png,image/gif,image/webp"
          label="Home card image (optional)"
          currentPath={item?.homeCardImage}
        />
      </div>

      <AdminLangTabs
        childrenEn={
          <div className={styles.formRow}>
            <div>
              <TextField label="Title (EN) *" name="titleEn" required defaultValue={item?.titleEn ?? ""} size="m" />
              {renderFieldError("titleEn")}
            </div>
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
        <Button type="submit" variant="primary" colorStyle="dark" size="m" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}

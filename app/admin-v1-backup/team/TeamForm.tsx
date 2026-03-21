"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, TextArea } from "@/design-system";
import { AdminLangTabs } from "../components/AdminLangTabs";
import { FileUploadField } from "../components/FileUploadField";
import type { TeamMember } from "@/lib/db/schema";
import type { TeamMemberSocial } from "@/lib/db/schema";
import { createTeamMember, updateTeamMember } from "@/lib/actions/team";
import styles from "../admin.module.css";

type MemberWithSocials = TeamMember & { socials?: TeamMemberSocial[] };

type Props = {
  item?: MemberWithSocials | null;
};

function socialsToPlatforms(socials: TeamMemberSocial[] | undefined): string {
  return socials?.map((s) => s.platform).join("\n") ?? "";
}
function socialsToLinks(socials: TeamMemberSocial[] | undefined): string {
  return socials?.map((s) => s.link).join("\n") ?? "";
}

export function TeamForm({ item }: Props) {
  const router = useRouter();
  const isEdit = !!item;
  const action = isEdit && item ? updateTeamMember.bind(null, item.id) : createTeamMember;
  const [state, formAction, isPending] = useActionState(action, {});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (state.success) {
      setSaved(true);
      const t = setTimeout(() => router.push("/admin/team?toast=success"), 1500);
      return () => clearTimeout(t);
    }
  }, [state.success, router]);

  const fieldError = (field: string) => state.fieldErrors?.[field];
  const renderFieldError = (field: string) => {
    const error = fieldError(field);
    return error ? <div style={{ fontSize: 13, color: "var(--error-600)", marginTop: 4 }}>{error}</div> : null;
  };

  return (
    <>
    <form action={formAction} className={`${styles.formCard} ${saved ? styles.formCardSaved : ""}`}>
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
        <label style={{ display: "block", marginBottom: 4 }}>
          <input
            type="checkbox"
            name="showOnHome"
            defaultChecked={item?.showOnHome === 1}
            style={{ marginRight: 8 }}
          />
          Show on homepage Team section
        </label>
      </div>
      <div className={styles.formRow}>
        <TextField
          label="Home order"
          name="homeOrder"
          type="number"
          min={0}
          defaultValue={item?.homeOrder ?? 0}
          size="m"
        />
      </div>

      <AdminLangTabs
        childrenEn={
          <div className={styles.formRow}>
            <div>
              <TextField label="Name (EN) *" name="titleEn" required defaultValue={item?.titleEn ?? ""} size="m" />
              {renderFieldError("titleEn")}
            </div>
            <div style={{ marginTop: 16 }}>
              <TextField label="Position (EN)" name="positionEn" defaultValue={item?.positionEn ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Description (EN)" name="descriptionEn" rows={3} defaultValue={item?.descriptionEn ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Quote (EN)" name="quoteEn" rows={2} defaultValue={item?.quoteEn ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Text 1 (EN)" name="text1En" rows={3} defaultValue={item?.text1En ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Text 2 (EN)" name="text2En" rows={3} defaultValue={item?.text2En ?? ""} size="m" />
            </div>
          </div>
        }
        childrenKa={
          <div className={styles.formRow}>
            <TextField label="Name (KA)" name="titleKa" defaultValue={item?.titleKa ?? ""} size="m" />
            <div style={{ marginTop: 16 }}>
              <TextField label="Position (KA)" name="positionKa" defaultValue={item?.positionKa ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Description (KA)" name="descriptionKa" rows={3} defaultValue={item?.descriptionKa ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Quote (KA)" name="quoteKa" rows={2} defaultValue={item?.quoteKa ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Text 1 (KA)" name="text1Ka" rows={3} defaultValue={item?.text1Ka ?? ""} size="m" />
            </div>
            <div style={{ marginTop: 16 }}>
              <TextArea label="Text 2 (KA)" name="text2Ka" rows={3} defaultValue={item?.text2Ka ?? ""} size="m" />
            </div>
          </div>
        }
      />

      <div className={styles.formRow} style={{ marginTop: 24 }}>
        <TextArea
          label="Social links – platform (one per line: LinkedIn, Twitter, etc.)"
          name="socialPlatforms"
          rows={3}
          defaultValue={socialsToPlatforms(item?.socials)}
          placeholder="LinkedIn&#10;Twitter"
          size="m"
        />
      </div>
      <div className={styles.formRow}>
        <TextArea
          label="Social links – URL (one per line, same order as platforms)"
          name="socialLinks"
          rows={3}
          defaultValue={socialsToLinks(item?.socials)}
          placeholder="https://...&#10;https://..."
          size="m"
        />
      </div>

      <div className={styles.formRow} style={{ marginTop: 24 }}>
        <Button type="submit" variant="primary" colorStyle="dark" size="m" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
    {saved && (
      <div className={styles.statusBar} role="status" aria-live="polite">
        <span className={styles.statusBarIcon}>✓</span>
        Saved successfully
      </div>
    )}
    </>
  );
}

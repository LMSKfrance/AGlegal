"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button, TextField, TextArea } from "@/design-system";
import { AdminLangTabs } from "../components/AdminLangTabs";
import type { TeamMember } from "@/lib/db/schema";
import type { TeamMemberSocial } from "@/lib/db/schema";
import { createTeamMember, updateTeamMember } from "@/lib/actions/team";
import styles from "../admin.module.css";

type MemberWithSocials = TeamMember & { socials?: TeamMemberSocial[] };

type Props = {
  item?: MemberWithSocials | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" colorStyle="dark" size="m" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </Button>
  );
}

function socialsToPlatforms(socials: TeamMemberSocial[] | undefined): string {
  return socials?.map((s) => s.platform).join("\n") ?? "";
}
function socialsToLinks(socials: TeamMemberSocial[] | undefined): string {
  return socials?.map((s) => s.link).join("\n") ?? "";
}

export function TeamForm({ item }: Props) {
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!item;

  async function handleAction(formData: FormData) {
    setError(null);
    const result = isEdit
      ? await updateTeamMember(item.id, {}, formData)
      : await createTeamMember({}, formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.success) {
      window.location.href = "/admin/team?toast=success";
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
            <TextField label="Name (EN) *" name="titleEn" required defaultValue={item?.titleEn ?? ""} size="m" />
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
        <SubmitButton />
      </div>
    </form>
  );
}

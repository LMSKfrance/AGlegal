"use client";

import { useRef, useState, useTransition } from "react";

interface Props {
  defaultTitle: string;
  defaultMessage: string;
  action: (formData: FormData) => Promise<void>;
}

export default function OfflineContentForm({ defaultTitle, defaultMessage, action }: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSaved(false);
    startTransition(async () => {
      await action(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ph ph-file-text" style={{ fontSize: 18, color: "#6b7280" }} />
          <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>Maintenance Page Content</span>
        </div>
      </div>
      <div className="card-body">
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "#6b7280" }}>
          Customise the text shown to visitors when the site is offline.
        </p>

        <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="label-base">Title</label>
            <input
              type="text"
              name="offline_title"
              className="input-base"
              defaultValue={defaultTitle}
              placeholder="AG Legal"
            />
          </div>

          <div>
            <label className="label-base">Message</label>
            <textarea
              name="offline_message"
              className="input-base"
              rows={3}
              defaultValue={defaultMessage}
              placeholder="This website is temporarily offline. Please check back soon."
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
              style={{ minWidth: 100 }}
            >
              {isPending ? "Saving…" : "Save"}
            </button>
            {saved && (
              <span style={{ fontSize: 13, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
                <i className="ph ph-check-circle" style={{ fontSize: 16 }} />
                Saved
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

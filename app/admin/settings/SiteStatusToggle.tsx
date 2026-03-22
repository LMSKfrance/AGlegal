"use client";

import { useTransition } from "react";

interface Props {
  online: boolean;
  action: (online: boolean) => Promise<void>;
}

export default function SiteStatusToggle({ online, action }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.checked;
    startTransition(async () => {
      await action(newValue);
    });
  }

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ph ph-globe" style={{ fontSize: 18, color: "#6b7280" }} />
          <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>Site Visibility</span>
        </div>
      </div>
      <div className="card-body">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 0",
          }}
        >
          <div>
            <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: "#111827" }}>
              Site Status
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
              {online
                ? "Site is live — all visitors can access it."
                : "Site is offline — only admins can access it. Guests see a maintenance page."}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginLeft: 24 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: online ? "#16a34a" : "#dc2626",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {online ? "Online" : "Offline"}
            </span>
            <label className="toggle-switch" style={{ opacity: isPending ? 0.6 : 1 }}>
              <input
                type="checkbox"
                checked={online}
                disabled={isPending}
                onChange={handleChange}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        {!online && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 14px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              fontSize: 13,
              color: "#991b1b",
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <i className="ph ph-warning" style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }} />
            <span>
              The public website is currently <strong>offline</strong>. Only logged-in admins can
              view it. Guests will see a maintenance page.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

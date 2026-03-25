"use client";

import { useTransition } from "react";

const ALL_NAV_LINKS = [
  { id: 1, title: "Home", url: "/" },
  { id: 2, title: "About us", url: "/about" },
  { id: 3, title: "Services", url: "/services" },
  { id: 5, title: "Team", url: "/team" },
  { id: 6, title: "Blog", url: "/news" },
  { id: 7, title: "Contact", url: "/contact" },
];

interface Props {
  hiddenIds: number[];
  action: (hiddenIds: number[]) => Promise<void>;
}

export default function NavigationForm({ hiddenIds, action }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(id: number, checked: boolean) {
    const next = checked
      ? hiddenIds.filter((h) => h !== id)
      : [...hiddenIds, id];
    startTransition(async () => {
      await action(next);
    });
  }

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ph ph-navigation-arrow" style={{ fontSize: 18, color: "#6b7280" }} />
          <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>Navigation Links</span>
        </div>
      </div>
      <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "#6b7280" }}>
          Toggle which links appear in both the inline header nav and the burger menu.
        </p>
        {ALL_NAV_LINKS.map((link, i) => {
          const visible = !hiddenIds.includes(link.id);
          return (
            <div
              key={link.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
                borderTop: i > 0 ? "1px solid #f3f4f6" : undefined,
                opacity: isPending ? 0.6 : 1,
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: "#111827" }}>
                  {link.title}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>{link.url}</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={visible}
                  disabled={isPending}
                  onChange={(e) => handleToggle(link.id, e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

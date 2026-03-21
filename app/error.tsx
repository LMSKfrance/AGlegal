"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SiteError]", error);
  }, [error]);

  return (
    <div style={{ padding: "48px 32px", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", marginBottom: 12 }}>
        Something went wrong
      </h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
        {error.message || "An unexpected error occurred."}
      </p>
      {error.digest && (
        <p style={{ fontFamily: "monospace", fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>
          Digest: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        style={{
          padding: "8px 20px",
          fontSize: 14,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}


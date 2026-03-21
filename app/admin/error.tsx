"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AdminError]", error);
  }, [error]);

  const isAuthError =
    error.message?.includes("MissingSecret") ||
    error.message?.includes("AUTH_SECRET") ||
    error.message?.includes("UntrustedHost") ||
    error.message?.includes("Server error");

  return (
    <div style={{ padding: "48px 32px", maxWidth: 600 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", marginBottom: 12 }}>
        {isAuthError ? "Server Configuration Error" : "Something went wrong"}
      </h1>

      {isAuthError ? (
        <div style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.6 }}>
          <p style={{ marginBottom: 16 }}>
            The <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>AUTH_SECRET</code> environment variable is not configured or is invalid.
          </p>
          <ol style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li style={{ marginBottom: 8 }}>Go to <strong>Netlify → Site configuration → Environment variables</strong></li>
            <li style={{ marginBottom: 8 }}>Add <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>AUTH_SECRET</code> — generate with: <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>openssl rand -base64 32</code></li>
            <li style={{ marginBottom: 8 }}>Also confirm <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>ADMIN_EMAIL</code> and <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>ADMIN_PASSWORD</code> are set</li>
            <li>Redeploy the site</li>
          </ol>
        </div>
      ) : (
        <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}>{error.message || "An unexpected error occurred."}</p>
          {error.digest && (
            <p style={{ fontFamily: "monospace", fontSize: 12, color: "#9ca3af" }}>Digest: {error.digest}</p>
          )}
        </div>
      )}

      <button
        onClick={reset}
        style={{
          padding: "8px 20px",
          fontSize: 14,
          fontWeight: 500,
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

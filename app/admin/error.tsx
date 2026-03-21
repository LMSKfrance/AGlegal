"use client";

import { useEffect, useState } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Only auto-retry once to handle transient errors
    if (retryCount === 0) {
      const t = setTimeout(() => {
        setRetryCount(1);
        reset();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [retryCount, reset]);

  // After first retry failed, show error UI
  if (retryCount === 0) return null;

  const isAuthError =
    error.message?.includes("MissingSecret") ||
    error.message?.includes("AUTH_SECRET") ||
    error.message?.includes("Server error");

  return (
    <div style={{ padding: "48px 32px", maxWidth: 600 }}>
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#1f2937",
          marginBottom: 12,
        }}
      >
        {isAuthError ? "Server Configuration Error" : "Something went wrong"}
      </h1>
      {isAuthError ? (
        <div style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.6 }}>
          <p style={{ marginBottom: 16 }}>
            The <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>AUTH_SECRET</code> environment variable is not configured. Admin login requires this to sign and verify session tokens.
          </p>
          <p style={{ marginBottom: 16 }}>To fix this:</p>
          <ol style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li style={{ marginBottom: 8 }}>
              Go to <strong>Netlify → Site configuration → Environment variables</strong>
            </li>
            <li style={{ marginBottom: 8 }}>
              Add <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>AUTH_SECRET</code> — generate with: <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>openssl rand -base64 32</code>
            </li>
            <li style={{ marginBottom: 8 }}>
              Also add <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>ADMIN_EMAIL</code> and <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>ADMIN_PASSWORD</code>
            </li>
            <li>Redeploy the site</li>
          </ol>
        </div>
      ) : (
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
          {error.message || "An unexpected error occurred."}
        </p>
      )}
      <button
        onClick={() => {
          setRetryCount(0);
          reset();
        }}
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

"use client";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: "3rem 2rem", textAlign: "center", fontFamily: "var(--font-inter, sans-serif)" }}>
      <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem", color: "var(--gray-900, #111)" }}>
        Something went wrong.
      </h2>
      <button
        onClick={reset}
        style={{ padding: "0.5rem 1.5rem", cursor: "pointer", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
      >
        Try again
      </button>
    </div>
  );
}

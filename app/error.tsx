"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: "4rem 2rem", textAlign: "center", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "1rem" }}>Something went wrong.</h2>
      <button
        onClick={reset}
        style={{ padding: "0.5rem 1.5rem", cursor: "pointer" }}
      >
        Try again
      </button>
    </div>
  );
}

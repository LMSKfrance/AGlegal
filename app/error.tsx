"use client";

import { useEffect } from "react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Auto-retry silently — most errors are transient (DB cold start).
    // A short delay lets the connection warm up before re-rendering.
    const t = setTimeout(reset, 300);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

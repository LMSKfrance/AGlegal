"use client";

import { useTransition } from "react";

export function DeleteButton({
  action,
  label,
}: {
  action: () => Promise<void>;
  label: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Delete "${label}"?`)) return;
    startTransition(() => action());
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="btn-icon text-red-500 hover:text-red-700"
      title="Delete"
    >
      <i className={`ph ${pending ? "ph-circle-notch animate-spin" : "ph-trash"}`} />
    </button>
  );
}

"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/design-system";

type Props = {
  label?: string;
};

export function DeleteButton({ label = "Delete" }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="ghost"
      size="s"
      disabled={pending}
      onClick={(e) => {
        if (!confirm("Are you sure you want to delete?")) e.preventDefault();
      }}
    >
      {pending ? "Deleting…" : label}
    </Button>
  );
}

"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/design-system";

type Props = {
  label?: string;
  size?: "m" | "s" | "xs";
};

export function SubmitButton({ label = "Save", size = "m" }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" colorStyle="dark" size={size} disabled={pending}>
      {pending ? "Saving…" : label}
    </Button>
  );
}

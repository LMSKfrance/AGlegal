"use client";

import { useFormStatus } from "react-dom";
import { Button, TextField } from "@/design-system";
import LogoMini from "@/design-system/components/LogoMini";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      fullWidth
      variant="primary"
      colorStyle="dark"
      size="m"
      disabled={pending}
    >
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

export default function LoginForm({
  action,
  hasError,
}: {
  action: (fd: FormData) => Promise<void>;
  hasError: boolean;
}) {
  return (
    <div
      style={{ minHeight: "100dvh", backgroundColor: "#f9fafb" }}
      className="flex items-center justify-center p-4"
    >
      <div className="w-full" style={{ maxWidth: 400 }}>
        {/* Logo */}
        <div className="flex justify-center mb-8" style={{ color: "#111827" }}>
          <LogoMini static />
        </div>

        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
          }}
        >
          <div className="px-8 pt-8 pb-1">
            <h1
              className="text-2xl font-semibold tracking-tight"
              style={{ color: "#111827" }}
            >
              Welcome back
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              Sign in to your admin account
            </p>
          </div>

          {hasError && (
            <div
              className="mx-8 mt-5 flex items-start gap-3 rounded-xl px-4 py-3"
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
              }}
              role="alert"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
                className="shrink-0 mt-0.5"
                style={{ color: "#ef4444" }}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm leading-relaxed" style={{ color: "#b91c1c" }}>
                Invalid email or password. Please try again.
              </p>
            </div>
          )}

          <form action={action} className="px-8 pt-5 pb-8 space-y-4">
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              size="m"
              state={hasError ? "error" : "default"}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              size="m"
              state={hasError ? "error" : "default"}
            />
            <div className="pt-2">
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

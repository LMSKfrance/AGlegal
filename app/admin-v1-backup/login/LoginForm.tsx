"use client";

import { useFormStatus } from "react-dom";
import { useState, useEffect, useRef } from "react";
import { Button, TextField } from "@/design-system";
import LogoMini from "@/design-system/components/LogoMini";
import styles from "./login.module.css";
import cn from "classnames";

// ─── Icons ────────────────────────────────────────────────────────────────────

function AlertIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ─── Submit button (uses form status) ─────────────────────────────────────────

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
      {pending ? (
        <>
          <Spinner />
          Signing in…
        </>
      ) : (
        "Sign in"
      )}
    </Button>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.35)",
        borderTopColor: "#fff",
        display: "inline-block",
        animation: "ag-spin 0.65s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LoginForm({
  action,
  hasError,
}: {
  action: (fd: FormData) => Promise<void>;
  hasError: boolean;
}) {
  const [showPw, setShowPw] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shake, setShake] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    const f = setTimeout(() => emailRef.current?.focus(), 380);
    return () => { clearTimeout(t); clearTimeout(f); };
  }, []);

  // Shake on error
  useEffect(() => {
    if (!hasError) return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 600);
    return () => clearTimeout(t);
  }, [hasError]);

  return (
    <>
      {/* Spinner keyframe */}
      <style>{`@keyframes ag-spin { to { transform: rotate(360deg); } }`}</style>

      <div className={styles.root}>
        {/* ── Left / Form panel ── */}
        <div className={styles.panelLeft}>
          {/* Topbar */}
          <div className={styles.topbar}>
            <div style={{ color: "var(--ag-blue-800)" }}>
              <LogoMini static />
            </div>
            <span className={styles.adminBadge}>Admin</span>
          </div>

          {/* Form area */}
          <div className={styles.formArea}>
            <div
              className={cn(
                styles.formWrap,
                mounted && styles.formWrapIn,
                shake && styles.formWrapShake
              )}
            >
              {/* Heading */}
              <div className={styles.heading}>
                <p className={styles.eyebrow}>Secure Portal</p>
                <h1 className={styles.headingH1}>
                  Welcome <span className={styles.headingAccent}>back.</span>
                </h1>
                <p className={styles.headingDesc}>
                  Sign in to your AG Legal admin account to continue.
                </p>
              </div>

              {/* Error banner */}
              {hasError && (
                <div className={styles.globalErr} role="alert">
                  <AlertIcon size={15} />
                  <span>Invalid email or password. Please try again.</span>
                </div>
              )}

              {/* Form */}
              <form action={action} className="space-y-4" noValidate>
                <TextField
                  ref={emailRef}
                  label="Email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@aglegal.ge"
                  size="m"
                  state={hasError ? "error" : "default"}
                  rightIcon={hasError ? <AlertIcon size={14} /> : undefined}
                />

                {/* Password field with show/hide toggle */}
                <div className={styles.pwWrapper}>
                  <TextField
                    label="Password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    size="m"
                    state={hasError ? "error" : "default"}
                    rightIcon={
                      // spacer so the text doesn't sit under the eye button
                      <span style={{ width: 28, display: "inline-block" }} />
                    }
                  />
                  <button
                    type="button"
                    className={cn(styles.eyeBtn, styles.eyeBtnWithLabel)}
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    <EyeIcon open={showPw} />
                  </button>
                </div>

                <div className={styles.submitArea}>
                  <SubmitButton />
                </div>
              </form>

              {/* Footer */}
              <div className={styles.formFooter}>
                Protected by enterprise-grade encryption.&nbsp;
                <button className={styles.formFooterLink} type="button">
                  Privacy Policy
                </button>
                {" · "}
                <button className={styles.formFooterLink} type="button">
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right / Brand panel ── */}
        <div className={styles.panelRight}>
          <div className={styles.dotsGrid}>
            {Array.from({ length: 49 }).map((_, i) => (
              <div key={i} className={styles.dot} />
            ))}
          </div>

          <div className={styles.rightTop}>
            <p className={styles.rightWordmark}>AG Legal</p>
            <h2 className={styles.rightHeadline}>
              Your Trusted
              <br />
              <span className={styles.rightAccent}>Legal</span>
              <br />
              Advisors.
            </h2>
            <p className={styles.rightDesc}>
              Join our mission to create a better tomorrow through legal and
              social support. Trusted by clients across Georgia.
            </p>
          </div>

          <p className={styles.rightBottom}>
            © 2026 AG Legal Consulting. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}

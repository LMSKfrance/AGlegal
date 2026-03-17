"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../admin.module.css";

const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
);

type Props = {
  name: string;
  accept: string;
  label: string;
  currentPath?: string | null;
};

export function FileUploadField({ name, accept, label, currentPath }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    if (file) {
      const url = URL.createObjectURL(file);
      prevUrlRef.current = url;
      setPreviewUrl(url);
      setFileName(file.name);
    } else {
      setPreviewUrl(null);
      setFileName(null);
    }
  }

  const displayPath = currentPath && !previewUrl ? currentPath : null;

  return (
    <div className={styles.fileUpload}>
      <span className={styles.fileUploadLabel}>{label}</span>
      <div className={styles.fileUploadZone}>
        <div className={styles.fileUploadIcon}>
          <UploadIcon />
        </div>
        <div className={styles.fileUploadText}>
          <span className={styles.fileUploadPrimary}>
            {fileName ?? "Click to upload or drag & drop"}
          </span>
          <span className={styles.fileUploadSecondary}>JPEG, PNG, WebP, GIF, SVG</span>
        </div>
        <input type="file" name={name} accept={accept} onChange={handleChange} />
      </div>

      {previewUrl && (
        <div style={{ marginTop: 8 }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, objectFit: "cover", border: "1px solid var(--gray-200)" }}
          />
        </div>
      )}

      {displayPath && (
        <div className={styles.fileUploadCurrent}>
          <img
            src={displayPath}
            alt="Current"
            style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
          />
          Current:&nbsp;
          <a href={displayPath} target="_blank" rel="noreferrer">
            {displayPath}
          </a>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";

type FileMeta = { filename: string; sizeLabel: string } | null;

type Props = {
  initialEn: FileMeta;
  initialKa: FileMeta;
};

const ACCEPT = ".pdf,.ppt,.pptx";
const MAX_MB = 25;

function formatSize(bytes: number) {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function LangSlot({
  lang,
  label,
  initial,
}: {
  lang: "en" | "ka";
  label: string;
  initial: FileMeta;
}) {
  const [meta, setMeta] = useState<FileMeta>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setSuccess(false);

    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File exceeds ${MAX_MB} MB limit.`);
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "ppt", "pptx"].includes(ext ?? "")) {
      setError("Only PDF, PPT, and PPTX files are allowed.");
      return;
    }

    setLoading(true);
    const fd = new FormData();
    fd.append("lang", lang);
    fd.append("file", file);

    const res = await fetch("/api/admin/upload-presentation", { method: "POST", body: fd });
    const json = await res.json();
    setLoading(false);

    if (!res.ok || json.error) {
      setError(json.error ?? "Upload failed.");
      return;
    }

    setMeta({ filename: json.filename, sizeLabel: json.sizeLabel });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  async function handleDelete() {
    if (!confirm(`Remove the ${label} presentation?`)) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/upload-presentation", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang }),
    });
    setLoading(false);
    if (res.ok) {
      setMeta(null);
    } else {
      const json = await res.json();
      setError(json.error ?? "Delete failed.");
    }
  }

  return (
    <div>
      <label className="label-base mb-2">
        {label}
        <span className="text-[10px] text-brand-400 font-normal ml-2">PDF, PPT, PPTX · max {MAX_MB} MB</span>
      </label>

      {meta ? (
        <div className="flex items-center gap-3 p-3 bg-brand-50 border border-brand-200 rounded-lg">
          <div className="w-9 h-9 bg-white rounded-lg border border-brand-200 flex items-center justify-center flex-shrink-0">
            <i className="ph ph-file-pdf text-[18px] text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-brand-900 truncate">{meta.filename}</p>
            <p className="text-[11px] text-brand-400">{meta.sizeLabel}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/api/presentation/${lang}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary text-[12px]"
              style={{ height: 30, padding: "0 10px" }}
            >
              <i className="ph ph-download-simple" /> Preview
            </a>
            <button
              type="button"
              className="btn btn-danger-outline text-[12px]"
              style={{ height: 30, padding: "0 10px" }}
              onClick={handleDelete}
              disabled={loading}
            >
              <i className="ph ph-trash" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`file-upload-zone flex flex-col items-center justify-center gap-2 h-28 cursor-pointer ${loading ? "opacity-60 pointer-events-none" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
        >
          {loading ? (
            <><i className="ph ph-spinner animate-spin text-xl text-brand-400" /><span className="text-[12px] text-brand-400">Uploading…</span></>
          ) : (
            <>
              <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center">
                <i className="ph ph-upload-simple text-lg text-brand-500" />
              </div>
              <span className="text-[12px] font-medium text-brand-600">Drop file here or click to browse</span>
              <span className="text-[11px] text-brand-400">PDF, PPT, PPTX · max {MAX_MB} MB</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="mt-2 text-[12px] text-red-600 flex items-center gap-1.5">
          <i className="ph ph-warning-circle" /> {error}
        </p>
      )}
      {success && (
        <p className="mt-2 text-[12px] text-green-600 flex items-center gap-1.5">
          <i className="ph ph-check-circle" /> Uploaded successfully.
        </p>
      )}
    </div>
  );
}

export default function PresentationUpload({ initialEn, initialKa }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <i className="ph ph-presentation-chart text-primary-600 text-[17px]" />
          <h2 className="font-semibold text-brand-900 text-[15px]">Upload Presentation</h2>
        </div>
        <p className="text-brand-400 text-[12px]">Linked in the footer — visitors can download it.</p>
      </div>
      <div className="card-body space-y-6">
        <LangSlot lang="en" label="English Version" initial={initialEn} />
        <div className="border-t border-brand-100" />
        <LangSlot lang="ka" label="Georgian Version" initial={initialKa} />
      </div>
    </div>
  );
}

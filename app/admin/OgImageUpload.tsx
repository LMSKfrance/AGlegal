"use client";

import { useRef, useState } from "react";

export default function OgImageUpload({
  existing,
  fallback,
}: {
  existing: string | null;
  fallback?: string | null;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existing);

  const displaySrc = preview ?? fallback ?? null;
  const isFallback = !preview && !!fallback;

  return (
    <div>
      <label className="label-base">
        OG Image{" "}
        <span className="text-xs font-normal text-brand-400 ml-2">
          Recommended 1200×630 — shared between EN/KA
        </span>
      </label>

      <div
        className="file-upload-zone relative flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        style={{ height: 160 }}
        onClick={() => fileRef.current?.click()}
      >
        {displaySrc ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displaySrc}
              alt="OG preview"
              className="w-full h-full object-cover rounded-lg"
            />
            {isFallback && (
              <div className="absolute inset-0 flex items-end justify-start p-2 pointer-events-none">
                <span className="text-[10px] font-medium bg-amber-500 text-white px-2 py-0.5 rounded-full">
                  Using main image as fallback
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
              <span className="opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full">
                Click to replace
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center mb-2">
              <i className="ph ph-image text-xl text-brand-500" />
            </div>
            <span className="text-[12px] font-medium text-brand-600">
              Upload OG image
            </span>
            <span className="text-[11px] text-brand-400 mt-1">
              1200×630 recommended
            </span>
          </>
        )}
      </div>

      {preview && (
        <button
          type="button"
          className="mt-1.5 text-[11px] text-red-500 hover:text-red-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setPreview(null);
            if (fileRef.current) fileRef.current.value = "";
          }}
        >
          Remove OG image{fallback ? " (will use main image)" : ""}
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        name="ogImage"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setPreview(URL.createObjectURL(f));
        }}
      />
    </div>
  );
}

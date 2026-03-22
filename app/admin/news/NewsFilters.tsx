"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export function NewsFilters({ q, type }: { q: string; type: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="p-4 border-b border-brand-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-white">
      <select
        className="input-base h-9 text-[13px] sm:w-48"
        value={type}
        onChange={(e) => update("type", e.target.value)}
      >
        <option value="">All Types</option>
        <option value="main">Main</option>
        <option value="side">Side</option>
      </select>
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <i className="ph ph-magnifying-glass text-brand-400 text-[17px]" />
        </span>
        <input
          type="text"
          className="input-base input-with-icon h-9 text-[13px] w-full sm:w-72"
          placeholder="Search articles..."
          defaultValue={q}
          onChange={(e) => update("q", e.target.value)}
        />
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useActionState, useState, useRef, useEffect } from "react";
import { useAdminLang } from "../AdminLangContext";
import type { ServiceFormState } from "@/lib/actions/services";

type Service = {
  id: number;
  slug: string;
  titleEn: string;
  titleKa: string | null;
  descriptionEn: string | null;
  descriptionKa: string | null;
  text1En: string | null;
  text1Ka: string | null;
  text2En: string | null;
  text2Ka: string | null;
  quoteEn: string | null;
  quoteKa: string | null;
  image: string | null;
  thumbnailImage: string | null;
  homeCardImage: string | null;
  showOnHome: number | null;
  homeOrder: number | null;
  homeShortDescriptionEn: string | null;
  homeShortDescriptionKa: string | null;
  homeLearnMoreUrl: string | null;
};

type Props = {
  action: (prev: ServiceFormState, formData: FormData) => Promise<ServiceFormState>;
  service?: Service;
};

const INITIAL: ServiceFormState = {};

export default function ServiceForm({ action, service }: Props) {
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const lang = useAdminLang();

  const mainImgRef = useRef<HTMLInputElement>(null);
  const thumbImgRef = useRef<HTMLInputElement>(null);
  const homeCardImgRef = useRef<HTMLInputElement>(null);

  const [mainPreview, setMainPreview] = useState<string | null>(service?.image ? `/api/images/${service.image}` : null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(service?.thumbnailImage ? `/api/images/${service.thumbnailImage}` : null);
  const [homeCardPreview, setHomeCardPreview] = useState<string | null>(service?.homeCardImage ? `/api/images/${service.homeCardImage}` : null);

  useEffect(() => {
    if (state.success) {
      window.location.href = "/admin/services";
    }
  }, [state.success]);

  return (
    <form action={formAction} className="relative bg-white flex flex-col min-h-full">
      <div className="border-b border-brand-200 px-8 py-5 flex items-center gap-4 bg-brand-50">
        <Link href="/admin/services" className="btn-icon bg-white border border-brand-200 shadow-sm">
          <i className="ph ph-arrow-left" />
        </Link>
        <h1 className="text-xl font-bold text-brand-900">{service ? "Edit Service" : "New Service"}</h1>
      </div>

      {state.error && (
        <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8 pb-24">
        <div className="card p-6 bg-brand-50 border border-brand-200 flex flex-wrap items-center gap-8 rounded-xl">
          <div className="flex items-center justify-between w-56">
            <span className="text-[14px] font-semibold text-brand-900">Show on Homepage</span>
            <label className="toggle-switch">
              <input type="checkbox" name="showOnHome" defaultChecked={service ? !!service.showOnHome : true} />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="w-px h-8 bg-brand-200" />
          <div className="flex items-center gap-4">
            <label className="label-base !mb-0">Homepage Order</label>
            <input type="number" name="homeOrder" className="input-base w-24 bg-white" defaultValue={service?.homeOrder ?? 1} />
          </div>
          <div className="w-px h-8 bg-brand-200" />
          <div className="flex items-center gap-4 flex-1">
            <label className="label-base !mb-0 whitespace-nowrap">Learn More URL</label>
            <input type="text" name="homeLearnMoreUrl" className="input-base bg-white" placeholder="/services/corporate" defaultValue={service?.homeLearnMoreUrl ?? ""} />
          </div>
        </div>

        <div>
          <label className="label-base required">Service Title {lang === "en" ? "(En)" : "(ქარ)"}</label>
          {lang === "en" ? (
            <input
              type="text"
              name="titleEn"
              className="input-base !text-3xl !font-bold !h-14 !border-0 !border-b-2 !border-brand-200 !rounded-none focus:!border-primary-600 focus:!ring-0 !px-0 bg-transparent"
              placeholder="Service title..."
              defaultValue={service?.titleEn ?? ""}
              required
            />
          ) : (
            <input
              type="text"
              name="titleKa"
              className="input-base !text-3xl !font-bold !h-14 !border-0 !border-b-2 !border-brand-200 !rounded-none focus:!border-primary-600 focus:!ring-0 !px-0 bg-transparent"
              placeholder="Service title (Georgian)..."
              defaultValue={service?.titleKa ?? ""}
            />
          )}
        </div>

        {/* Images */}
        <div className="grid grid-cols-3 gap-8">
          {/* Main Cover Image */}
          <div>
            <label className="label-base">Main Cover Image</label>
            <div
              className="file-upload-zone p-4 flex flex-col items-center gap-2 h-32 justify-center cursor-pointer overflow-hidden"
              onClick={() => mainImgRef.current?.click()}
            >
              {mainPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mainPreview} alt="cover" className="h-full w-full object-cover rounded" />
              ) : (
                <>
                  <i className="ph ph-upload-simple text-xl text-brand-500" />
                  <span className="text-[11px] font-medium text-brand-600 text-center">Upload image</span>
                </>
              )}
            </div>
            <input
              ref={mainImgRef}
              type="file"
              name="image"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setMainPreview(URL.createObjectURL(f)); }}
            />
          </div>

          {/* Thumbnail Image */}
          <div>
            <label className="label-base">Thumbnail Image</label>
            <div
              className="file-upload-zone p-4 flex flex-col items-center gap-2 h-32 justify-center cursor-pointer overflow-hidden"
              onClick={() => thumbImgRef.current?.click()}
            >
              {thumbPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbPreview} alt="thumbnail" className="h-full w-full object-cover rounded" />
              ) : (
                <>
                  <i className="ph ph-upload-simple text-xl text-brand-500" />
                  <span className="text-[11px] font-medium text-brand-600 text-center">Upload image</span>
                </>
              )}
            </div>
            <input
              ref={thumbImgRef}
              type="file"
              name="thumbnailImage"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setThumbPreview(URL.createObjectURL(f)); }}
            />
          </div>

          {/* Home Card Image */}
          <div>
            <label className="label-base">Home Card Image</label>
            <div
              className="file-upload-zone p-4 flex flex-col items-center gap-2 h-32 justify-center cursor-pointer overflow-hidden"
              onClick={() => homeCardImgRef.current?.click()}
            >
              {homeCardPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={homeCardPreview} alt="home card" className="h-full w-full object-cover rounded" />
              ) : (
                <>
                  <i className="ph ph-upload-simple text-xl text-brand-500" />
                  <span className="text-[11px] font-medium text-brand-600 text-center">Upload image</span>
                </>
              )}
            </div>
            <input
              ref={homeCardImgRef}
              type="file"
              name="homeCardImage"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setHomeCardPreview(URL.createObjectURL(f)); }}
            />
          </div>
        </div>

        <div>
          <label className="label-base">Homepage Short Description {lang === "en" ? "(En)" : "(ქარ)"}</label>
          {lang === "en" ? (
            <textarea name="homeShortDescriptionEn" className="input-base" rows={2} placeholder="Brief summary for homepage card..." defaultValue={service?.homeShortDescriptionEn ?? ""} />
          ) : (
            <textarea name="homeShortDescriptionKa" className="input-base" rows={2} placeholder="Brief summary (Georgian)..." defaultValue={service?.homeShortDescriptionKa ?? ""} />
          )}
        </div>

        <div className="border-t border-brand-200 pt-8 space-y-6">
          <div>
            <label className="label-base">Full Description {lang === "en" ? "(En)" : "(ქარ)"}</label>
            {lang === "en" ? (
              <textarea name="descriptionEn" className="input-base" rows={3} defaultValue={service?.descriptionEn ?? ""} />
            ) : (
              <textarea name="descriptionKa" className="input-base" rows={3} defaultValue={service?.descriptionKa ?? ""} />
            )}
          </div>
          <div>
            <label className="label-base">Text Section 1 {lang === "en" ? "(En)" : "(ქარ)"}</label>
            {lang === "en" ? (
              <textarea name="text1En" className="input-base" rows={3} defaultValue={service?.text1En ?? ""} />
            ) : (
              <textarea name="text1Ka" className="input-base" rows={3} defaultValue={service?.text1Ka ?? ""} />
            )}
          </div>
          <div>
            <label className="label-base">Text Section 2 {lang === "en" ? "(En)" : "(ქარ)"}</label>
            {lang === "en" ? (
              <textarea name="text2En" className="input-base" rows={3} defaultValue={service?.text2En ?? ""} />
            ) : (
              <textarea name="text2Ka" className="input-base" rows={3} defaultValue={service?.text2Ka ?? ""} />
            )}
          </div>
          <div>
            <label className="label-base">Highlight Quote {lang === "en" ? "(En)" : "(ქარ)"}</label>
            {lang === "en" ? (
              <textarea name="quoteEn" className="input-base italic" rows={2} defaultValue={service?.quoteEn ?? ""} />
            ) : (
              <textarea name="quoteKa" className="input-base italic" rows={2} defaultValue={service?.quoteKa ?? ""} />
            )}
          </div>
        </div>
      </div>

      <div className="action-bar">
        <div className="flex gap-3 w-full justify-end">
          <Link href="/admin/services" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? (
              <><i className="ph ph-spinner animate-spin" /> Saving...</>
            ) : (
              <><i className="ph ph-floppy-disk" /> {service ? "Save Changes" : "Save Service"}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

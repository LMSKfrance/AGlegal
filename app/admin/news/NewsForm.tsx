"use client";

import Link from "next/link";
import { useActionState, useState, useRef, useEffect } from "react";
import { useAdminLang } from "../AdminLangContext";
import type { NewsFormState } from "@/lib/actions/news";

type Article = {
  id: number;
  slug: string;
  titleEn: string;
  titleKa: string | null;
  descriptionEn: string | null;
  descriptionKa: string | null;
  contentEn: string | null;
  contentKa: string | null;
  image: string | null;
  date: string;
  time: string | null;
  tags: string[] | null;
  type: string | null;
  metaDescriptionEn: string | null;
  metaDescriptionKa: string | null;
  seoTitleEn: string | null;
  seoTitleKa: string | null;
  ogTitleEn: string | null;
  ogTitleKa: string | null;
  ogDescriptionEn: string | null;
  ogDescriptionKa: string | null;
  ogImage: string | null;
};

type Props = {
  action: (prev: NewsFormState, formData: FormData) => Promise<NewsFormState>;
  article?: Article;
};

const INITIAL: NewsFormState = {};

function slugPreview(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60) || "article-slug";
}

export default function NewsForm({ action, article }: Props) {
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const [hasSaved, setHasSaved] = useState(false);
  const lang = useAdminLang();
  const [titleEn, setTitleEn] = useState(article?.titleEn ?? "");
  const [imagePreview, setImagePreview] = useState<string | null>(article?.image ?? null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Redirect on success
  useEffect(() => {
    if (state.success) {
      setHasSaved(true);
      window.location.href = "/admin/news";
    }
  }, [state.success]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function applyMarkdown(wrap: string, textarea: HTMLTextAreaElement) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = `${wrap}${selected || "text"}${wrap}`;
    textarea.setRangeText(replacement, start, end, "select");
    textarea.focus();
  }

  function insertMarkdown(prefix: string, textarea: HTMLTextAreaElement) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = `${prefix}${selected || "text"}`;
    textarea.setRangeText(replacement, start, end, "end");
    textarea.focus();
  }

  const contentId = `content-${lang}`;

  return (
    <form ref={formRef} action={formAction} className="relative bg-white flex flex-col min-h-full">
      <div className="border-b border-brand-200 px-4 sm:px-8 py-4 flex items-center gap-4 bg-brand-50">
        <Link href="/admin/news" className="btn-icon bg-white border border-brand-200 shadow-sm">
          <i className="ph ph-arrow-left" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-brand-900">{article ? "Edit Article" : "New Article"}</h1>
          <div className="text-[12px] text-brand-500 mt-1">
            {article ? `Editing: ${article.slug}` : "Draft — not published"}
          </div>
        </div>
      </div>

      {state.error && (
        <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-8 pb-24">
        {/* Title */}
        <div className="space-y-4">
          <div>
            <label className="label-base required text-lg">
              Article Title {lang === "en" ? "(En)" : "(ქარ)"}
            </label>
            {lang === "en" ? (
              <input
                type="text"
                name="titleEn"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="input-base !text-3xl !font-bold !h-14 !border-0 !border-b-2 !border-brand-200 !rounded-none focus:!border-primary-600 focus:!ring-0 !px-0 bg-transparent"
                placeholder="Enter title..."
                required
              />
            ) : (
              <input
                type="text"
                name="titleKa"
                defaultValue={article?.titleKa ?? ""}
                className="input-base !text-3xl !font-bold !h-14 !border-0 !border-b-2 !border-brand-200 !rounded-none focus:!border-primary-600 focus:!ring-0 !px-0 bg-transparent"
                placeholder="Enter title (Georgian)..."
              />
            )}
          </div>
          {lang === "en" && (
            <div className="flex items-center gap-2 text-xs text-brand-400">
              <span>Slug:</span>
              <span className="font-mono bg-brand-50 px-2 py-1 rounded border border-brand-200">
                /news/{slugPreview(titleEn)}
              </span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-brand-50 rounded-lg border border-brand-200">
          <div>
            <label className="label-base required">Content Type</label>
            <select name="type" className="input-base bg-white" defaultValue={article?.type ?? ""}>
              <option value="">News Notice</option>
              <option value="News Notice">News Notice</option>
              <option value="In-depth Article">In-depth Article</option>
              <option value="Blog Post">Blog Post</option>
              <option value="Press Release">Press Release</option>
            </select>
          </div>
          <div>
            <label className="label-base">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              className="input-base bg-white"
              placeholder="e.g. Taxation, Corporate"
              defaultValue={article?.tags?.join(", ") ?? ""}
            />
          </div>
          <div>
            <label className="label-base required">Publication Date</label>
            <input
              type="date"
              name="date"
              className="input-base bg-white"
              required
              defaultValue={article?.date ?? new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div>
            <label className="label-base">Publication Time</label>
            <input
              type="time"
              name="time"
              className="input-base bg-white"
              placeholder="09:00"
              defaultValue={article?.time ?? ""}
            />
          </div>
        </div>

        {/* Featured image */}
        <div>
          <label className="label-base">Featured Image</label>
          <div
            className="file-upload-zone flex flex-col items-center gap-3 h-40 justify-center cursor-pointer relative"
            onClick={() => fileRef.current?.click()}
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
            ) : (
              <>
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <i className="ph ph-upload-simple text-xl text-brand-500" />
                </div>
                <span className="text-[12px] font-medium text-brand-600">Drop image here or click to browse</span>
                <span className="text-[11px] text-brand-400">JPG, PNG · Max 5MB</span>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              name="image"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="label-base">
            Short Description / Excerpt {lang === "en" ? "(En)" : "(ქარ)"}
          </label>
          {lang === "en" ? (
            <textarea
              name="descriptionEn"
              className="input-base"
              rows={3}
              placeholder="Brief summary shown in article listings..."
              defaultValue={article?.descriptionEn ?? ""}
            />
          ) : (
            <textarea
              name="descriptionKa"
              className="input-base"
              rows={3}
              placeholder="Brief summary (Georgian)..."
              defaultValue={article?.descriptionKa ?? ""}
            />
          )}
        </div>

        {/* Content editor */}
        <div className="md-editor-wrap">
          <div className="md-toolbar">
            <button
              type="button"
              title="Bold"
              onClick={() => {
                const ta = document.getElementById(contentId) as HTMLTextAreaElement;
                if (ta) applyMarkdown("**", ta);
              }}
            >
              <i className="ph ph-text-b" />
            </button>
            <button
              type="button"
              title="Italic"
              onClick={() => {
                const ta = document.getElementById(contentId) as HTMLTextAreaElement;
                if (ta) applyMarkdown("_", ta);
              }}
            >
              <i className="ph ph-text-italic" />
            </button>
            <div className="w-px h-5 bg-brand-200 mx-2" />
            <button
              type="button"
              title="Heading 2"
              onClick={() => {
                const ta = document.getElementById(contentId) as HTMLTextAreaElement;
                if (ta) insertMarkdown("## ", ta);
              }}
            >
              <i className="ph ph-text-h-two" />
            </button>
            <button
              type="button"
              title="Heading 3"
              onClick={() => {
                const ta = document.getElementById(contentId) as HTMLTextAreaElement;
                if (ta) insertMarkdown("### ", ta);
              }}
            >
              <i className="ph ph-text-h-three" />
            </button>
            <div className="w-px h-5 bg-brand-200 mx-2" />
            <button
              type="button"
              title="Link"
              onClick={() => {
                const ta = document.getElementById(contentId) as HTMLTextAreaElement;
                if (ta) {
                  const url = prompt("Enter URL:");
                  if (url) {
                    const start = ta.selectionStart;
                    const end = ta.selectionEnd;
                    const text = ta.value.substring(start, end) || "link text";
                    ta.setRangeText(`[${text}](${url})`, start, end, "end");
                    ta.focus();
                  }
                }
              }}
            >
              <i className="ph ph-link" />
            </button>
            <button type="button" title="Image" onClick={() => fileRef.current?.click()}>
              <i className="ph ph-image" />
            </button>
            <button
              type="button"
              title="List"
              onClick={() => {
                const ta = document.getElementById(contentId) as HTMLTextAreaElement;
                if (ta) insertMarkdown("- ", ta);
              }}
            >
              <i className="ph ph-list-bullets" />
            </button>
            <button
              type="button"
              title="Quote"
              onClick={() => {
                const ta = document.getElementById(contentId) as HTMLTextAreaElement;
                if (ta) insertMarkdown("> ", ta);
              }}
            >
              <i className="ph ph-quotes" />
            </button>
            <div className="flex-1" />
            <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider px-2">Markdown Supported</span>
          </div>
          {lang === "en" ? (
            <textarea
              id={`content-en`}
              name="contentEn"
              className="input-base w-full p-6 font-mono text-[14px] leading-relaxed bg-[#fbfcfd]"
              placeholder="Start writing content here..."
              rows={10}
              defaultValue={article?.contentEn ?? ""}
            />
          ) : (
            <textarea
              id={`content-ka`}
              name="contentKa"
              className="input-base w-full p-6 font-mono text-[14px] leading-relaxed bg-[#fbfcfd]"
              placeholder="Start writing content (Georgian)..."
              rows={10}
              defaultValue={article?.contentKa ?? ""}
            />
          )}
        </div>

        {/* SEO & Open Graph */}
        <div className="card">
          <div className="card-header py-4 bg-brand-50">
            <h3 className="font-semibold text-brand-900 text-[14px]">
              <i className="ph ph-magnifying-glass mr-2 text-brand-500" /> SEO &amp; Open Graph {lang === "en" ? "(En)" : "(ქარ)"}
            </h3>
          </div>
          <div className="card-body space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="label-base">SEO Title</label>
                {lang === "en"
                  ? <input type="text" name="seoTitleEn" className="input-base" defaultValue={article?.seoTitleEn ?? ""} />
                  : <input type="text" name="seoTitleKa" className="input-base" defaultValue={article?.seoTitleKa ?? ""} />}
              </div>
              <div>
                <label className="label-base">OG Title</label>
                {lang === "en"
                  ? <input type="text" name="ogTitleEn" className="input-base" defaultValue={article?.ogTitleEn ?? ""} />
                  : <input type="text" name="ogTitleKa" className="input-base" defaultValue={article?.ogTitleKa ?? ""} />}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="label-base">Meta Description</label>
                {lang === "en"
                  ? <textarea name="metaDescriptionEn" className="input-base" rows={2} defaultValue={article?.metaDescriptionEn ?? ""} />
                  : <textarea name="metaDescriptionKa" className="input-base" rows={2} defaultValue={article?.metaDescriptionKa ?? ""} />}
              </div>
              <div>
                <label className="label-base">OG Description</label>
                {lang === "en"
                  ? <textarea name="ogDescriptionEn" className="input-base" rows={2} defaultValue={article?.ogDescriptionEn ?? ""} />
                  : <textarea name="ogDescriptionKa" className="input-base" rows={2} defaultValue={article?.ogDescriptionKa ?? ""} />}
              </div>
            </div>
            <div>
              <label className="label-base">OG Image URL <span className="text-xs font-normal text-brand-400 ml-2">(Recommended 1200×630)</span></label>
              <input type="text" name="ogImage" className="input-base" placeholder="/uploads/og-image.jpg" defaultValue={article?.ogImage ?? ""} />
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="action-bar">
        <div className="text-[12px] flex items-center gap-1.5">
          {state.error ? (
            <><span className="w-2 h-2 rounded-full bg-red-500 shrink-0 inline-block" /><span className="text-red-600 font-medium truncate max-w-xs">{state.error}</span></>
          ) : pending ? (
            <><span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 inline-block animate-pulse" /><span className="text-brand-500 font-medium">Saving…</span></>
          ) : hasSaved ? (
            <><span className="w-2 h-2 rounded-full bg-green-500 shrink-0 inline-block" /><span className="text-brand-500">All changes saved</span></>
          ) : (
            <><span className="w-2 h-2 rounded-full bg-brand-300 shrink-0 inline-block" /><span className="text-brand-400">You have not made any changes</span></>
          )}
        </div>
        <div className="flex gap-3">
          <Link href="/admin/news" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? (
              <><i key="spinner" className="ph ph-spinner animate-spin" /> Saving...</>
            ) : (
              <><i key="send" className="ph ph-paper-plane-tilt" /> {article ? "Update Article" : "Publish Article"}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

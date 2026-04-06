"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect, useRef, useState, useCallback } from "react";

type Props = {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
};

/** Convert plain-text storage (textarea newlines) to clean TipTap HTML.
 *  - If the value already contains HTML tags, pass through unchanged.
 *  - Otherwise treat \n as a soft word-wrap (→ space) and \n\n as a
 *    real paragraph break (→ </p><p>). */
function toEditorHtml(val: string | null | undefined): string {
  const str = (val ?? "").trim();
  if (!str) return "";
  if (/<[a-z][\s\S]*>/i.test(str)) return str; // already HTML
  return str
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, "<br>").trim()}</p>`)
    .join("");
}

export default function RichTextEditor({ name, defaultValue, placeholder }: Props) {
  const [html, setHtml] = useState(defaultValue ?? "");
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, blockquote: false, code: false, codeBlock: false, horizontalRule: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
    ],
    content: toEditorHtml(defaultValue),
    editorProps: {
      attributes: {
        class: "rte-content",
        "data-placeholder": placeholder ?? "Write bio…",
      },
    },
    onUpdate({ editor }) {
      const value = editor.isEmpty ? "" : editor.getHTML();
      setHtml(value);
    },
  });

  // Re-initialise when defaultValue changes (language switch / save remount)
  useEffect(() => {
    if (!editor) return;
    const next = toEditorHtml(defaultValue);
    if (editor.getHTML() !== next) {
      editor.commands.setContent(next);
      setHtml(next);
    }
  }, [defaultValue, editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const openLinkInput = () => {
    if (!editor) return;
    const existing = editor.getAttributes("link").href ?? "";
    setLinkUrl(existing);
    setShowLinkInput(true);
    setTimeout(() => linkInputRef.current?.focus(), 50);
  };

  if (!editor) return null;

  const active = (mark: string) => editor.isActive(mark);

  return (
    <div className="rte-wrapper">
      {/* Toolbar */}
      <div className="rte-toolbar">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          className={`rte-btn${active("bold") ? " rte-btn--active" : ""}`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          className={`rte-btn${active("italic") ? " rte-btn--active" : ""}`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <div className="rte-divider" />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); openLinkInput(); }}
          className={`rte-btn${active("link") ? " rte-btn--active" : ""}`}
          title="Link"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
        {active("link") && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetLink().run(); }}
            className="rte-btn rte-btn--danger"
            title="Remove link"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <div className="rte-divider" />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          className={`rte-btn${active("bulletList") ? " rte-btn--active" : ""}`}
          title="Bullet list"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
            <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
          className={`rte-btn${active("orderedList") ? " rte-btn--active" : ""}`}
          title="Numbered list"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
            <text x="1" y="8" fontSize="8" fontWeight="700" fill="currentColor" stroke="none">1</text>
            <text x="1" y="14" fontSize="8" fontWeight="700" fill="currentColor" stroke="none">2</text>
            <text x="1" y="20" fontSize="8" fontWeight="700" fill="currentColor" stroke="none">3</text>
          </svg>
        </button>
        <div className="rte-divider" />
        <span className="rte-hint">↵ new paragraph &nbsp;·&nbsp; Shift+↵ line break</span>
      </div>

      {/* Inline link URL input */}
      {showLinkInput && (
        <div className="rte-link-bar">
          <input
            ref={linkInputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyLink(); } if (e.key === "Escape") { setShowLinkInput(false); } }}
            placeholder="https://..."
            className="rte-link-input"
          />
          <button type="button" onClick={applyLink} className="rte-link-apply">Apply</button>
          <button type="button" onClick={() => setShowLinkInput(false)} className="rte-link-cancel">✕</button>
        </div>
      )}

      {/* Editor area */}
      <EditorContent editor={editor} />

      {/* Hidden input synced with HTML — submitted with the form */}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

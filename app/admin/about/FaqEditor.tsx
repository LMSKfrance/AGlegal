"use client";

import { useActionState, useState } from "react";
import { upsertFaq, deleteFaq } from "@/lib/actions/faq";
import type { FaqFormState } from "@/lib/actions/faq";
import { useAdminLang } from "../AdminLangContext";

type Faq = {
  id: number;
  questionEn: string;
  questionKa: string | null;
  answerEn: string;
  answerKa: string | null;
  sortOrder: number | null;
};

const INITIAL: FaqFormState = {};

function FaqCard({
  faq,
  index,
  onDelete,
}: {
  faq: Faq;
  index: number;
  onDelete: (id: number) => void;
}) {
  const lang = useAdminLang();
  const action = upsertFaq.bind(null, faq.id);
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this FAQ entry?")) return;
    setDeleting(true);
    const result = await deleteFaq(faq.id);
    if (result.success) onDelete(faq.id);
    else setDeleting(false);
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="sortOrder" value={faq.sortOrder ?? index} />
      <div className="card mb-4">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-brand-100">
          <div className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">FAQ #{index + 1}</div>
          <div className="flex items-center gap-2">
            {state.error && <span className="text-[11px] text-red-600 font-medium">{state.error}</span>}
            {state.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
            <button type="submit" className="btn-save" disabled={pending} title="Save FAQ">
              {pending ? <i className="ph ph-spinner animate-spin" /> : <i className="ph ph-floppy-disk" />}
            </button>
            <button
              type="button"
              className="btn-save !text-red-400 !bg-red-50 !border-red-200 hover:!text-white hover:!bg-red-500 hover:!border-red-500"
              onClick={handleDelete}
              disabled={deleting}
              title="Delete FAQ"
            >
              {deleting ? <i className="ph ph-spinner animate-spin" /> : <i className="ph ph-trash" />}
            </button>
          </div>
        </div>
        <div className="card-body space-y-4">
          <div>
            <label className="label-base">Question {lang === "en" ? "(EN)" : "(ქარ)"}</label>
            <input
              type="text"
              name={lang === "en" ? "questionEn" : "questionKa"}
              className="input-base"
              defaultValue={lang === "en" ? faq.questionEn : (faq.questionKa ?? "")}
            />
            <input
              type="hidden"
              name={lang === "en" ? "questionKa" : "questionEn"}
              value={lang === "en" ? (faq.questionKa ?? "") : faq.questionEn}
            />
          </div>
          <div>
            <label className="label-base">Answer {lang === "en" ? "(EN)" : "(ქარ)"}</label>
            <textarea
              name={lang === "en" ? "answerEn" : "answerKa"}
              className="input-base"
              rows={3}
              defaultValue={lang === "en" ? faq.answerEn : (faq.answerKa ?? "")}
            />
            <input
              type="hidden"
              name={lang === "en" ? "answerKa" : "answerEn"}
              value={lang === "en" ? (faq.answerKa ?? "") : faq.answerEn}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

function NewFaqCard() {
  const lang = useAdminLang();
  const action = upsertFaq.bind(null, null);
  const [state, formAction, pending] = useActionState(action, INITIAL);

  return (
    <form action={formAction}>
      <input type="hidden" name="sortOrder" value={999} />
      <div className="card border-dashed border-2 border-brand-200">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-brand-100">
          <div className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">New FAQ</div>
          <div className="flex items-center gap-2">
            {state.error && <span className="text-[11px] text-red-600 font-medium">{state.error}</span>}
            {state.success && <span className="text-[11px] text-green-600 font-medium">Created!</span>}
            <button type="submit" className="btn-save" disabled={pending} title="Add FAQ">
              {pending ? <i className="ph ph-spinner animate-spin" /> : <i className="ph ph-plus" />}
            </button>
          </div>
        </div>
        <div className="card-body space-y-4">
          <div>
            <label className="label-base">Question {lang === "en" ? "(EN)" : "(ქარ)"} <span className="text-red-400">*</span></label>
            <input
              type="text"
              name={lang === "en" ? "questionEn" : "questionKa"}
              className="input-base"
              placeholder={lang === "en" ? "What services do you offer?" : ""}
            />
            <input type="hidden" name={lang === "en" ? "questionKa" : "questionEn"} value="" />
          </div>
          <div>
            <label className="label-base">Answer {lang === "en" ? "(EN)" : "(ქარ)"} <span className="text-red-400">*</span></label>
            <textarea
              name={lang === "en" ? "answerEn" : "answerKa"}
              className="input-base"
              rows={3}
              placeholder={lang === "en" ? "We provide comprehensive legal services..." : ""}
            />
            <input type="hidden" name={lang === "en" ? "answerKa" : "answerEn"} value="" />
          </div>
        </div>
      </div>
    </form>
  );
}

export default function FaqEditor({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [faqList, setFaqList] = useState<Faq[]>(initialFaqs);

  function handleDelete(id: number) {
    setFaqList((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div>
      {faqList.map((faq, index) => (
        <FaqCard key={faq.id} faq={faq} index={index} onDelete={handleDelete} />
      ))}
      <NewFaqCard />
    </div>
  );
}

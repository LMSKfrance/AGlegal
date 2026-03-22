"use client";

import { useActionState, useEffect, useState } from "react";
import type { EmailSettingsState } from "@/lib/actions/settings";

type Props = {
  defaultBookingEmail: string;
  defaultContactEmail: string;
  action: (prev: EmailSettingsState, formData: FormData) => Promise<EmailSettingsState>;
};

const INITIAL: EmailSettingsState = {};

export default function NotificationsForm({ defaultBookingEmail, defaultContactEmail, action }: Props) {
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (state.success) {
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(t);
    }
  }, [state.success]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <i className="ph ph-envelope text-brand-500 text-[17px]" />
          <h2 className="font-semibold text-brand-900 text-[15px]">Receive Emails</h2>
        </div>
        <p className="text-brand-400 text-[12px]">
          Destination addresses for form submission notifications
        </p>
      </div>

      <form action={formAction} className="card-body space-y-5">
        {state.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-700">
            {state.error}
          </div>
        )}

        {/* Book a Call */}
        <div>
          <label className="label-base" htmlFor="bookingEmail">
            <i className="ph ph-calendar-check text-brand-400" />
            Book a Call form
          </label>
          <input
            id="bookingEmail"
            type="text"
            name="bookingEmail"
            className="input-base"
            placeholder="office@example.com, partner@example.com"
            defaultValue={defaultBookingEmail}
          />
          <p className="mt-1.5 text-[11px] text-brand-400">
            Separate multiple addresses with a comma.
          </p>
        </div>

        {/* Contact Form */}
        <div>
          <label className="label-base" htmlFor="contactEmail">
            <i className="ph ph-chat-text text-brand-400" />
            Contact form
          </label>
          <input
            id="contactEmail"
            type="text"
            name="contactEmail"
            className="input-base"
            placeholder="office@example.com, partner@example.com"
            defaultValue={defaultContactEmail}
          />
          <p className="mt-1.5 text-[11px] text-brand-400">
            Separate multiple addresses with a comma.
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[12px] text-brand-400 flex items-center gap-1.5">
            {saved && (
              <>
                <i className="ph ph-check-circle text-green-500" />
                <span className="text-green-600">Saved</span>
              </>
            )}
          </span>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? (
              <><i className="ph ph-spinner animate-spin" /> Saving…</>
            ) : (
              <><i className="ph ph-floppy-disk" /> Save</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

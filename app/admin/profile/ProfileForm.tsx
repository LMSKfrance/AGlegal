"use client";

import { useActionState } from "react";
import type { ProfileFormState } from "@/lib/actions/adminProfile";

type Props = {
  name: string;
  email: string;
  initials: string;
  action: (prev: ProfileFormState, formData: FormData) => Promise<ProfileFormState>;
};

const INITIAL: ProfileFormState = {};

export default function ProfileForm({ name, email, initials, action }: Props) {
  const [state, formAction, pending] = useActionState(action, INITIAL);

  return (
    <>
      {state.error && (
        <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="mx-8 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          Profile updated successfully.
        </div>
      )}

      <div className="page-content max-w-2xl ml-0 space-y-6 pt-6">
        {/* Avatar card */}
        <div className="card p-8 flex gap-6 items-center">
          <div className="w-24 h-24 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-3xl shadow-sm">
            {initials}
          </div>
          <div>
            <div className="font-bold text-xl text-brand-900">{name}</div>
            <div className="text-brand-500 text-[14px] mt-1">Administrator</div>
          </div>
        </div>

        <form action={formAction}>
          {/* Personal details */}
          <div className="card">
            <div className="card-header"><h3 className="font-semibold text-brand-900 text-[15px]">Personal Details</h3></div>
            <div className="card-body space-y-5">
              <div>
                <label className="label-base">Full Name</label>
                <input type="text" name="name" className="input-base max-w-md" defaultValue={name} required />
              </div>
              <div>
                <label className="label-base">Email Address</label>
                <input type="email" name="email" className="input-base max-w-md bg-brand-50 cursor-not-allowed" defaultValue={email} disabled />
                <input type="hidden" name="email" value={email} />
              </div>
              <div><label className="label-base">Current Password <span className="text-brand-400 text-xs font-normal">(required to save changes)</span></label>
                <input type="password" name="currentPassword" className="input-base max-w-md" />
              </div>
              <div><label className="label-base">New Password <span className="text-brand-400 text-xs font-normal">(leave blank to keep current)</span></label>
                <input type="password" name="newPassword" className="input-base max-w-md" />
              </div>
              <div><label className="label-base">Confirm New Password</label>
                <input type="password" name="confirmPassword" className="input-base max-w-md" />
              </div>
              <button type="submit" className="btn btn-primary mt-2" disabled={pending}>
                {pending ? <><i className="ph ph-spinner animate-spin" /> Saving...</> : "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

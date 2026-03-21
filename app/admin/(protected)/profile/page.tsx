import { auth } from "@/auth";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

export default async function ProfilePage() {
  const session = await auth();
  const name = session?.user?.name ?? "Admin User";
  const email = session?.user?.email ?? "";
  const initials = getInitials(name);

  return (
    <>
      <div className="page-header border-b border-brand-200 sticky top-0 bg-[#f8fafc]/95 backdrop-blur z-10 pb-6 pt-8">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Admin Profile</h1>
          <p className="text-brand-500 mt-2">Manage your account settings and password.</p>
        </div>
      </div>

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

        {/* Personal details */}
        <div className="card">
          <div className="card-header"><h3 className="font-semibold text-brand-900 text-[15px]">Personal Details</h3></div>
          <div className="card-body space-y-5">
            <div>
              <label className="label-base">Full Name</label>
              <input type="text" className="input-base max-w-md" defaultValue={name} />
            </div>
            <div>
              <label className="label-base">Email Address</label>
              <input type="email" className="input-base max-w-md bg-brand-50 cursor-not-allowed" defaultValue={email} disabled />
            </div>
            <button className="btn btn-secondary mt-2">Update Details</button>
          </div>
        </div>

        {/* Change password */}
        <div className="card">
          <div className="card-header"><h3 className="font-semibold text-brand-900 text-[15px]">Change Password</h3></div>
          <div className="card-body space-y-5 max-w-md">
            <div><label className="label-base required">Current Password</label><input type="password" className="input-base" /></div>
            <div><label className="label-base required">New Password</label><input type="password" className="input-base" /></div>
            <div><label className="label-base required">Confirm New Password</label><input type="password" className="input-base" /></div>
            <button className="btn btn-primary mt-2">Update Password</button>
          </div>
        </div>
      </div>
    </>
  );
}

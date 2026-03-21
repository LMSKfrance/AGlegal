import Link from "next/link";
import { getAdminStats } from "@/lib/admin/stats";
import { getSaveHistory } from "@/lib/actions/history";

export const dynamic = "force-dynamic";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const ACTION_DOT: Record<string, string> = {
  created: "bg-green-500",
  updated: "bg-blue-500",
  deleted: "bg-red-500",
};

export default async function DashboardPage() {
  const [stats, history] = await Promise.all([
    getAdminStats(),
    getSaveHistory(5),
  ]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Dashboard</h1>
          <p className="text-brand-500 mt-2">Overview of your CMS content and recent activity.</p>
        </div>
      </div>

      <div className="page-content pb-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center text-[28px]">
              <i className="ph-fill ph-newspaper" />
            </div>
            <div>
              <div className="text-[32px] font-bold text-brand-900 leading-none">{stats.articles}</div>
              <div className="text-[11px] font-bold text-brand-400 uppercase tracking-wider mt-1.5">News Articles</div>
            </div>
          </div>
          <div className="card p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-[#e0e7ff] text-[#4f46e5] flex items-center justify-center text-[28px]">
              <i className="ph-fill ph-users" />
            </div>
            <div>
              <div className="text-[32px] font-bold text-brand-900 leading-none">{stats.teamMembers}</div>
              <div className="text-[11px] font-bold text-brand-400 uppercase tracking-wider mt-1.5">Team Members</div>
            </div>
          </div>
          <div className="card p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-[#d1fae5] text-[#059669] flex items-center justify-center text-[28px]">
              <i className="ph-fill ph-briefcase" />
            </div>
            <div>
              <div className="text-[32px] font-bold text-brand-900 leading-none">{stats.services}</div>
              <div className="text-[11px] font-bold text-brand-400 uppercase tracking-wider mt-1.5">Services</div>
            </div>
          </div>
          <div className="card p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center text-[28px]">
              <i className="ph-fill ph-files" />
            </div>
            <div>
              <div className="text-[32px] font-bold text-brand-900 leading-none">{stats.pages}</div>
              <div className="text-[11px] font-bold text-brand-400 uppercase tracking-wider mt-1.5">Static Pages</div>
            </div>
          </div>
        </div>

        {/* Content Status */}
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
              <i className="ph ph-warning-circle text-amber-500" /> Content Status
            </h2>
            <Link href="/admin/notifications" className="text-[12px] font-bold text-primary-600 hover:text-primary-800 uppercase tracking-wider">
              View all tasks
            </Link>
          </div>
          <div className="card-body p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-5 bg-[#fefce8] rounded-xl border border-[#fef08a]">
                <div className="w-10 h-10 rounded-full bg-amber-100/50 text-amber-500 flex items-center justify-center shrink-0">
                  <i className="ph ph-translate text-[20px]" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-brand-900">3 Missing Translations</div>
                  <div className="text-[12px] text-brand-500 mt-0.5">News articles</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-[#fef2f2] rounded-xl border border-[#fecaca]">
                <div className="w-10 h-10 rounded-full bg-red-100/50 text-red-500 flex items-center justify-center shrink-0">
                  <i className="ph ph-image text-[20px]" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-brand-900">1 Missing Photo</div>
                  <div className="text-[12px] text-brand-500 mt-0.5">Team member</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-[#eff6ff] rounded-xl border border-[#bfdbfe]">
                <div className="w-10 h-10 rounded-full bg-blue-100/50 text-blue-500 flex items-center justify-center shrink-0">
                  <i className="ph ph-user-circle-minus text-[20px]" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-brand-900">Incomplete Profile</div>
                  <div className="text-[12px] text-brand-500 mt-0.5">1 Service page</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card h-fit">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                <i className="ph ph-lightning text-primary-600" /> Quick Actions
              </h2>
            </div>
            <div className="card-body p-6">
              <div className="grid grid-cols-3 gap-4">
                <Link href="/admin/news/new" className="btn flex-col h-auto py-5 px-3 gap-3 bg-white border border-brand-200 hover:bg-brand-50 hover:border-brand-300 group transition-all rounded-xl shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <i className="ph-fill ph-newspaper text-2xl" />
                  </div>
                  <span className="text-[13px] font-medium text-brand-900 text-center">New Article</span>
                </Link>
                <Link href="/admin/team/new" className="btn flex-col h-auto py-5 px-3 gap-3 bg-white border border-brand-200 hover:bg-brand-50 hover:border-brand-300 group transition-all rounded-xl shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                    <i className="ph-fill ph-users text-2xl" />
                  </div>
                  <span className="text-[13px] font-medium text-brand-900 text-center">Add Member</span>
                </Link>
                <Link href="/admin/services/new" className="btn flex-col h-auto py-5 px-3 gap-3 bg-white border border-brand-200 hover:bg-brand-50 hover:border-brand-300 group transition-all rounded-xl shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                    <i className="ph-fill ph-briefcase text-2xl" />
                  </div>
                  <span className="text-[13px] font-medium text-brand-900 text-center">Add Service</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                <i className="ph ph-clock-counter-clockwise text-brand-500" /> Recent Activity
              </h2>
              <Link href="/admin/history" className="text-[11px] font-bold text-primary-600 hover:text-primary-800 uppercase tracking-wider">
                View full history
              </Link>
            </div>
            <div className="divide-y divide-brand-100">
              {history.length === 0 ? (
                <div className="flex items-center justify-between p-5 hover:bg-brand-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <div className="text-[14px] font-semibold text-brand-900">No recent activity yet</div>
                      <div className="text-[12px] text-brand-500 mt-0.5">Changes will appear here</div>
                    </div>
                  </div>
                </div>
              ) : (
                history.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-5 hover:bg-brand-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${ACTION_DOT[entry.action] ?? "bg-brand-400"}`} />
                      <div>
                        <div className="text-[14px] font-semibold text-brand-900">
                          {entry.section}: {entry.label}
                        </div>
                        <div className="text-[12px] text-brand-500 mt-0.5">
                          {entry.action} · {formatDate(entry.savedAt)} {formatTime(entry.savedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

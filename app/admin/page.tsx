import Link from "next/link";
import { getAdminStats } from "@/lib/admin/stats";
import { getSaveHistory } from "@/lib/actions/history";
import { getNotificationTasks } from "@/lib/admin/notifications";

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
  created: "bg-[#107E3E]",
  updated: "bg-[#0854A0]",
  deleted: "bg-[#AB0000]",
};

export default async function DashboardPage() {
  const [stats, history, tasks] = await Promise.all([
    getAdminStats(),
    getSaveHistory(5),
    getNotificationTasks(),
  ]);

  // Group tasks by severity for the Content Status summary
  const translationTasks = tasks.filter((t) => t.badge === "Translation");
  const photoTasks = tasks.filter((t) => t.id.includes("photo") || t.id.includes("image"));
  const incompleteTasks = tasks.filter((t) => t.badge === "Required" || t.id.includes("incomplete"));
  const seoTasks = tasks.filter((t) => t.badge === "SEO" || t.badge === "OG Image");
  const totalTranslationCount = translationTasks.reduce((s, t) => s + t.count, 0);
  const totalPhotoCount = photoTasks.reduce((s, t) => s + t.count, 0);
  const totalSeoCount = seoTasks.reduce((s, t) => s + t.count, 0);

  return (
    <>
      <div className="page-header">
        <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Dashboard</h1>
      </div>

      <div className="page-content pb-12">
        {/* Stats — clickable cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Link href="/admin/news" className="card p-4 md:p-6 flex items-center gap-4 md:gap-5 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg bg-[#E0EDFF] text-[#0070F2] flex items-center justify-center text-xl md:text-[28px]">
              <i className="ph-fill ph-newspaper" />
            </div>
            <div>
              <div className="text-2xl md:text-[32px] font-bold text-brand-900 leading-none">{stats.articles}</div>
              <div className="text-[11px] font-bold text-brand-400 uppercase tracking-wider mt-1.5">News Articles</div>
            </div>
          </Link>
          <Link href="/admin/team" className="card p-4 md:p-6 flex items-center gap-4 md:gap-5 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg bg-[#F0ECF9] text-[#5A1E96] flex items-center justify-center text-xl md:text-[28px]">
              <i className="ph-fill ph-users" />
            </div>
            <div>
              <div className="text-2xl md:text-[32px] font-bold text-brand-900 leading-none">{stats.teamMembers}</div>
              <div className="text-[11px] font-bold text-brand-400 uppercase tracking-wider mt-1.5">Team Members</div>
            </div>
          </Link>
          <Link href="/admin/services" className="card p-4 md:p-6 flex items-center gap-4 md:gap-5 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg bg-[#EBF5E0] text-[#107E3E] flex items-center justify-center text-xl md:text-[28px]">
              <i className="ph-fill ph-briefcase" />
            </div>
            <div>
              <div className="text-2xl md:text-[32px] font-bold text-brand-900 leading-none">{stats.services}</div>
              <div className="text-[11px] font-bold text-brand-400 uppercase tracking-wider mt-1.5">Services</div>
            </div>
          </Link>
          <Link href="/admin/pages" className="card p-4 md:p-6 flex items-center gap-4 md:gap-5 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg bg-[#FFF8D6] text-[#B44F00] flex items-center justify-center text-xl md:text-[28px]">
              <i className="ph-fill ph-files" />
            </div>
            <div>
              <div className="text-2xl md:text-[32px] font-bold text-brand-900 leading-none">{stats.pages}</div>
              <div className="text-[11px] font-bold text-brand-400 uppercase tracking-wider mt-1.5">Static Pages</div>
            </div>
          </Link>
        </div>

        {/* Content Status */}
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
              <i className="ph ph-warning-circle text-[#B44F00]" /> Content Status
            </h2>
            <Link href="/admin/notifications" className="text-[12px] font-bold text-primary-600 hover:text-primary-800 uppercase tracking-wider">
              View all tasks
            </Link>
          </div>
          <div className="card-body p-6">
            {tasks.length === 0 ? (
              <div className="flex items-center gap-4 p-5 bg-[#EBF5E0] rounded-lg border border-[#ABD77A]">
                <div className="w-10 h-10 rounded-full bg-[#D4EEC0] text-[#107E3E] flex items-center justify-center shrink-0">
                  <i className="ph ph-check-circle text-[20px]" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-brand-900">All content is complete</div>
                  <div className="text-[12px] text-[#107E3E] mt-0.5">No pending tasks</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Translations */}
                {totalTranslationCount > 0 && (
                  <Link href="/admin/notifications" className="flex items-center gap-4 p-5 bg-[#FFF8D6] rounded-lg border border-[#F0AB00] hover:brightness-95 transition-all">
                    <div className="w-10 h-10 rounded-full bg-[#FFF3B7] text-[#B44F00] flex items-center justify-center shrink-0">
                      <i className="ph ph-translate text-[20px]" />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-brand-900">{totalTranslationCount} Missing Translation{totalTranslationCount > 1 ? "s" : ""}</div>
                      <div className="text-[12px] text-[#B44F00] mt-0.5">{translationTasks.map((t) => t.href.replace("/admin/", "")).join(", ")}</div>
                    </div>
                  </Link>
                )}
                {/* Photos / Images */}
                {totalPhotoCount > 0 && (
                  <Link href="/admin/notifications" className="flex items-center gap-4 p-5 bg-[#FFEBEB] rounded-lg border border-[#E8A5A5] hover:brightness-95 transition-all">
                    <div className="w-10 h-10 rounded-full bg-[#FFD6D6] text-[#AB0000] flex items-center justify-center shrink-0">
                      <i className="ph ph-image text-[20px]" />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-brand-900">{totalPhotoCount} Missing Photo{totalPhotoCount > 1 ? "s" : ""}</div>
                      <div className="text-[12px] text-[#AB0000] mt-0.5">{photoTasks.map((t) => t.href.replace("/admin/", "")).join(", ")}</div>
                    </div>
                  </Link>
                )}
                {/* Incomplete / Required */}
                {incompleteTasks.length > 0 && (
                  <Link href="/admin/notifications" className="flex items-center gap-4 p-5 bg-[#E8F4FD] rounded-lg border border-[#91C8F6] hover:brightness-95 transition-all">
                    <div className="w-10 h-10 rounded-full bg-[#D4ECF8] text-[#0854A0] flex items-center justify-center shrink-0">
                      <i className="ph ph-warning text-[20px]" />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-brand-900">{incompleteTasks.length} Incomplete Section{incompleteTasks.length > 1 ? "s" : ""}</div>
                      <div className="text-[12px] text-[#0854A0] mt-0.5">{incompleteTasks.map((t) => t.href.replace("/admin/", "")).join(", ")}</div>
                    </div>
                  </Link>
                )}
                {/* SEO / OG */}
                {totalSeoCount > 0 && (
                  <Link href="/admin/notifications" className="flex items-center gap-4 p-5 bg-[#F0ECF9] rounded-lg border border-[#C9B8E8] hover:brightness-95 transition-all">
                    <div className="w-10 h-10 rounded-full bg-[#E4D9F5] text-[#5A1E96] flex items-center justify-center shrink-0">
                      <i className="ph ph-magnifying-glass text-[20px]" />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-brand-900">{totalSeoCount} Missing SEO / OG</div>
                      <div className="text-[12px] text-[#5A1E96] mt-0.5">{seoTasks.map((t) => t.href.replace("/admin/", "")).join(", ")}</div>
                    </div>
                  </Link>
                )}
              </div>
            )}
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
                <Link href="/admin/news/new" className="btn flex-col h-auto py-5 px-3 gap-3 bg-white border border-brand-200 hover:bg-brand-50 hover:border-brand-300 group transition-all rounded-lg shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-[#E0EDFF] text-[#0070F2] flex items-center justify-center group-hover:brightness-95 transition-all">
                    <i className="ph-fill ph-newspaper text-2xl" />
                  </div>
                  <span className="text-[13px] font-medium text-brand-900 text-center">New Article</span>
                </Link>
                <Link href="/admin/team/new" className="btn flex-col h-auto py-5 px-3 gap-3 bg-white border border-brand-200 hover:bg-brand-50 hover:border-brand-300 group transition-all rounded-lg shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-[#F0ECF9] text-[#5A1E96] flex items-center justify-center group-hover:brightness-95 transition-all">
                    <i className="ph-fill ph-users text-2xl" />
                  </div>
                  <span className="text-[13px] font-medium text-brand-900 text-center">Add Member</span>
                </Link>
                <Link href="/admin/services/new" className="btn flex-col h-auto py-5 px-3 gap-3 bg-white border border-brand-200 hover:bg-brand-50 hover:border-brand-300 group transition-all rounded-lg shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-[#EBF5E0] text-[#107E3E] flex items-center justify-center group-hover:brightness-95 transition-all">
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
                    <div className="w-2 h-2 rounded-full bg-[#0854A0] mt-1.5 shrink-0" />
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

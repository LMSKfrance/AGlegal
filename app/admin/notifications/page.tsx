import Link from "next/link";
import { getNotificationTasks, type NotificationTask } from "@/lib/admin/notifications";
import { Pagination } from "@/app/admin/_components/Pagination";

export const dynamic = "force-dynamic";

const PER_PAGE = 8;

const SEVERITY_STYLES = {
  critical: {
    icon: "bg-[#FFEBEB] text-[#AB0000]",
    badge: "badge-red",
  },
  warning: {
    icon: "bg-[#FFF8D6] text-[#B44F00]",
    badge: "badge-amber",
  },
  info: {
    icon: "bg-[#E8F4FD] text-[#0854A0]",
    badge: "badge-blue",
  },
};

const CATEGORY_ICON: Record<string, string> = {
  "news-missing-ka":        "ph-translate",
  "news-missing-image":     "ph-image",
  "team-missing-photo":     "ph-image",
  "team-missing-ka":        "ph-translate",
  "services-missing-ka":    "ph-translate",
  "services-missing-image": "ph-image",
  "pages-missing-ka":       "ph-translate",
  "contact-incomplete":     "ph-address-book",
};

function TaskRow({ task }: { task: NotificationTask }) {
  const style = SEVERITY_STYLES[task.severity];
  const icon = CATEGORY_ICON[task.id] ?? "ph-warning-circle";

  return (
    <div className="flex items-start gap-4 p-5 hover:bg-brand-50 transition-colors">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style.icon}`}>
        <i className={`ph ${icon} text-2xl`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <span className="text-[14px] font-bold text-brand-900">{task.title}</span>
          <span className={`badge ${style.badge}`}>{task.badge}</span>
        </div>
        <p className="text-[13px] text-brand-600 mb-2.5">{task.description}</p>
        <Link
          href={task.href}
          className="text-[13px] font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1.5"
        >
          <i className="ph ph-arrow-right" /> Go to {task.href.replace("/admin/", "").replace(/^\w/, (c) => c.toUpperCase())}
        </Link>
      </div>
    </div>
  );
}

export default async function NotificationsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const tasks = await getNotificationTasks();
  const count = tasks.length;

  const currentPage = Math.max(1, parseInt(page ?? "1") || 1);
  const totalPages = Math.ceil(count / PER_PAGE);
  const paged = tasks.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <>
      <div className="pb-6 pt-8 border-b border-brand-200 px-8">
        <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Tasks &amp; Notifications</h1>
      </div>

      <div className="page-content pt-6">
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
              <i className="ph ph-warning-circle text-[#B44F00]" /> Pending Tasks
              {count > 0 ? (
                <span className="ml-2 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-[#FFF8D6] text-[#B44F00]">
                  {count} item{count > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="ml-2 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-[#EBF5E0] text-[#107E3E]">
                  All clear
                </span>
              )}
            </h2>
          </div>

          {count === 0 ? (
            <div className="p-10 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-[#EBF5E0] text-[#107E3E] flex items-center justify-center text-3xl">
                <i className="ph ph-check-circle" />
              </div>
              <div className="text-[15px] font-semibold text-brand-900">Everything is complete!</div>
              <div className="text-[13px] text-brand-500">All content is filled in and translated.</div>
            </div>
          ) : (
            <>
              <div className="divide-y divide-brand-100">
                {paged.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin/notifications" />
            </>
          )}
        </div>
      </div>
    </>
  );
}

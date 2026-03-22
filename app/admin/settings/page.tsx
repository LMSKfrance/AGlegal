import {
  getSiteOnlineStatus,
  setSiteOnlineStatus,
  getOfflinePageContent,
  saveOfflinePageContent,
} from "@/lib/actions/settings";
import SiteStatusToggle from "./SiteStatusToggle";
import OfflineContentForm from "./OfflineContentForm";

export default async function SiteSettingsPage() {
  const [online, offlineContent] = await Promise.all([
    getSiteOnlineStatus(),
    getOfflinePageContent(),
  ]);

  async function updateStatus(newOnline: boolean) {
    "use server";
    await setSiteOnlineStatus(newOnline);
  }

  async function updateOfflineContent(formData: FormData) {
    "use server";
    const title = (formData.get("offline_title") as string) ?? "";
    const message = (formData.get("offline_message") as string) ?? "";
    await saveOfflinePageContent(title, message);
  }

  return (
    <>
      <div className="pb-6 pt-8 border-b border-brand-200 px-8">
        <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Site Settings</h1>
        <p className="text-brand-500 mt-2">Control site-wide visibility and maintenance mode.</p>
      </div>

      <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
        <SiteStatusToggle online={online} action={updateStatus} />
        <OfflineContentForm
          defaultTitle={offlineContent.title}
          defaultMessage={offlineContent.message}
          action={updateOfflineContent}
        />
      </div>
    </>
  );
}

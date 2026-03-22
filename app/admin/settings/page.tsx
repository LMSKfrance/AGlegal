import { getSiteOnlineStatus, setSiteOnlineStatus } from "@/lib/actions/settings";
import SiteStatusToggle from "./SiteStatusToggle";

export default async function SiteSettingsPage() {
  const online = await getSiteOnlineStatus();

  async function updateStatus(newOnline: boolean) {
    "use server";
    await setSiteOnlineStatus(newOnline);
  }

  return (
    <>
      <div className="pb-6 pt-8 border-b border-brand-200 px-8">
        <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Site Settings</h1>
        <p className="text-brand-500 mt-2">Control site-wide visibility and maintenance mode.</p>
      </div>

      <div style={{ padding: "32px" }}>
        <SiteStatusToggle online={online} action={updateStatus} />
      </div>
    </>
  );
}

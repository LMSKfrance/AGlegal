import { getNavVisibility, saveNavVisibility } from "@/lib/actions/settings";
import NavigationForm from "./NavigationForm";

export default async function NavigationSettingsPage() {
  const hiddenIds = await getNavVisibility();

  async function update(newHiddenIds: number[]) {
    "use server";
    await saveNavVisibility(newHiddenIds);
  }

  return (
    <>
      <div className="pb-6 pt-8 border-b border-brand-200 px-8">
        <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Navigation</h1>
        <p className="text-brand-500 mt-2">Control which links appear in the header and burger menu.</p>
      </div>

      <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
        <NavigationForm hiddenIds={hiddenIds} action={update} />
      </div>
    </>
  );
}

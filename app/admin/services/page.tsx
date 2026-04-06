import { getPageBySlug } from "@/lib/actions/pages";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ServicesAdminRedirect() {
  let page = await getPageBySlug("services");

  if (!page) {
    // Auto-create the services page record so it can be edited
    await db.insert(pages).values({
      slug: "services",
      titleEn: "Services",
      updatedAt: new Date().toISOString(),
    });
    page = await getPageBySlug("services");
  }

  if (page) {
    redirect(`/admin/pages/${page.id}/edit`);
  }

  redirect("/admin/pages");
}

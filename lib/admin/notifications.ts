import { db } from "@/lib/db";
import {
  articles,
  teamMembers,
  services,
  pages,
  contactSettings,
} from "@/lib/db/schema";

export type TaskSeverity = "warning" | "critical" | "info";

export type NotificationTask = {
  id: string;
  severity: TaskSeverity;
  /** Badge label shown next to the title */
  badge: string;
  title: string;
  description: string;
  /** Number of affected records */
  count: number;
  href: string;
};

function empty(v: string | null | undefined): boolean {
  return !v || v.trim() === "";
}

export async function getNotificationTasks(): Promise<NotificationTask[]> {
  const tasks: NotificationTask[] = [];

  const [allArticles, allTeam, allServices, allPages, contact] =
    await Promise.all([
      db.select().from(articles),
      db.select().from(teamMembers),
      db.select().from(services),
      db.select().from(pages),
      db.select().from(contactSettings).limit(1),
    ]);

  // ── News: missing KA translation ────────────────────────────────────────────
  const newsNoKa = allArticles.filter(
    (a) => empty(a.titleKa) || empty(a.descriptionKa) || empty(a.contentKa)
  );
  if (newsNoKa.length > 0) {
    tasks.push({
      id: "news-missing-ka",
      severity: "warning",
      badge: "Translation",
      title: `${newsNoKa.length} Missing Georgian Translation${newsNoKa.length > 1 ? "s" : ""}`,
      description: `${newsNoKa.length} news article${newsNoKa.length > 1 ? "s are" : " is"} missing Georgian (ქარ) translation.`,
      count: newsNoKa.length,
      href: "/admin/news",
    });
  }

  // ── News: missing image ──────────────────────────────────────────────────────
  const newsNoImage = allArticles.filter((a) => empty(a.image));
  if (newsNoImage.length > 0) {
    tasks.push({
      id: "news-missing-image",
      severity: "info",
      badge: "Image",
      title: `${newsNoImage.length} Article${newsNoImage.length > 1 ? "s" : ""} Missing Image`,
      description: `${newsNoImage.length} news article${newsNoImage.length > 1 ? "s have" : " has"} no cover image uploaded.`,
      count: newsNoImage.length,
      href: "/admin/news",
    });
  }

  // ── Team: missing profile photo ──────────────────────────────────────────────
  const teamNoPhoto = allTeam.filter((m) => empty(m.image));
  if (teamNoPhoto.length > 0) {
    tasks.push({
      id: "team-missing-photo",
      severity: "critical",
      badge: "Photo Required",
      title: `${teamNoPhoto.length} Missing Profile Photo${teamNoPhoto.length > 1 ? "s" : ""}`,
      description: `${teamNoPhoto.length} team member${teamNoPhoto.length > 1 ? "s have" : " has"} no profile photo uploaded.`,
      count: teamNoPhoto.length,
      href: "/admin/team",
    });
  }

  // ── Team: missing KA name or position ───────────────────────────────────────
  const teamNoKa = allTeam.filter(
    (m) => empty(m.titleKa) || empty(m.positionKa)
  );
  if (teamNoKa.length > 0) {
    tasks.push({
      id: "team-missing-ka",
      severity: "warning",
      badge: "Translation",
      title: `${teamNoKa.length} Team Member${teamNoKa.length > 1 ? "s" : ""} Missing ქარ Info`,
      description: `${teamNoKa.length} team member${teamNoKa.length > 1 ? "s are" : " is"} missing Georgian name or position.`,
      count: teamNoKa.length,
      href: "/admin/team",
    });
  }

  // ── Services: missing KA translation ────────────────────────────────────────
  const servicesNoKa = allServices.filter(
    (s) => empty(s.titleKa) || empty(s.descriptionKa)
  );
  if (servicesNoKa.length > 0) {
    tasks.push({
      id: "services-missing-ka",
      severity: "warning",
      badge: "Translation",
      title: `${servicesNoKa.length} Service${servicesNoKa.length > 1 ? "s" : ""} Missing ქარ Translation`,
      description: `${servicesNoKa.length} service page${servicesNoKa.length > 1 ? "s are" : " is"} missing Georgian translation.`,
      count: servicesNoKa.length,
      href: "/admin/services",
    });
  }

  // ── Services: missing image ──────────────────────────────────────────────────
  const servicesNoImage = allServices.filter((s) => empty(s.image));
  if (servicesNoImage.length > 0) {
    tasks.push({
      id: "services-missing-image",
      severity: "info",
      badge: "Image",
      title: `${servicesNoImage.length} Service${servicesNoImage.length > 1 ? "s" : ""} Missing Image`,
      description: `${servicesNoImage.length} service page${servicesNoImage.length > 1 ? "s have" : " has"} no image uploaded.`,
      count: servicesNoImage.length,
      href: "/admin/services",
    });
  }

  // ── Pages: missing KA content ────────────────────────────────────────────────
  const pagesNoKa = allPages.filter(
    (p) => empty(p.titleKa) || empty(p.contentKa)
  );
  if (pagesNoKa.length > 0) {
    tasks.push({
      id: "pages-missing-ka",
      severity: "warning",
      badge: "Translation",
      title: `${pagesNoKa.length} Page${pagesNoKa.length > 1 ? "s" : ""} Missing ქარ Translation`,
      description: `${pagesNoKa.length} static page${pagesNoKa.length > 1 ? "s are" : " is"} missing Georgian translation.`,
      count: pagesNoKa.length,
      href: "/admin/pages",
    });
  }

  // ── News: missing SEO meta description ──────────────────────────────────────
  const newsNoSeo = allArticles.filter((a) => empty(a.metaDescriptionEn));
  if (newsNoSeo.length > 0) {
    tasks.push({
      id: "news-missing-seo",
      severity: "warning",
      badge: "SEO",
      title: `${newsNoSeo.length} Article${newsNoSeo.length > 1 ? "s" : ""} Missing SEO Data`,
      description: `${newsNoSeo.length} news article${newsNoSeo.length > 1 ? "s have" : " has"} no meta description — won't appear well in search results.`,
      count: newsNoSeo.length,
      href: "/admin/news",
    });
  }

  // ── Services: missing SEO meta description ───────────────────────────────────
  const servicesNoSeo = allServices.filter((s) => empty(s.metaDescriptionEn));
  if (servicesNoSeo.length > 0) {
    tasks.push({
      id: "services-missing-seo",
      severity: "warning",
      badge: "SEO",
      title: `${servicesNoSeo.length} Service${servicesNoSeo.length > 1 ? "s" : ""} Missing SEO Data`,
      description: `${servicesNoSeo.length} service page${servicesNoSeo.length > 1 ? "s have" : " has"} no meta description set.`,
      count: servicesNoSeo.length,
      href: "/admin/services",
    });
  }

  // ── Team: missing SEO meta description ───────────────────────────────────────
  const teamNoSeo = allTeam.filter((m) => empty(m.metaDescriptionEn));
  if (teamNoSeo.length > 0) {
    tasks.push({
      id: "team-missing-seo",
      severity: "warning",
      badge: "SEO",
      title: `${teamNoSeo.length} Team Member${teamNoSeo.length > 1 ? "s" : ""} Missing SEO Data`,
      description: `${teamNoSeo.length} team member page${teamNoSeo.length > 1 ? "s have" : " has"} no meta description set.`,
      count: teamNoSeo.length,
      href: "/admin/team",
    });
  }

  // ── Pages: missing SEO meta description ──────────────────────────────────────
  const pagesNoSeo = allPages.filter((p) => empty(p.metaDescriptionEn));
  if (pagesNoSeo.length > 0) {
    tasks.push({
      id: "pages-missing-seo",
      severity: "warning",
      badge: "SEO",
      title: `${pagesNoSeo.length} Page${pagesNoSeo.length > 1 ? "s" : ""} Missing SEO Data`,
      description: `${pagesNoSeo.length} static page${pagesNoSeo.length > 1 ? "s have" : " has"} no meta description set.`,
      count: pagesNoSeo.length,
      href: "/admin/pages",
    });
  }

  // ── OG Image missing across all content ──────────────────────────────────────
  const noOgCount =
    allArticles.filter((a) => empty(a.ogImage)).length +
    allServices.filter((s) => empty(s.ogImage)).length +
    allTeam.filter((m) => empty(m.ogImage)).length +
    allPages.filter((p) => empty(p.ogImage)).length;
  if (noOgCount > 0) {
    tasks.push({
      id: "content-missing-og-image",
      severity: "info",
      badge: "OG Image",
      title: `${noOgCount} Page${noOgCount > 1 ? "s" : ""} Missing OG Image`,
      description: `${noOgCount} content page${noOgCount > 1 ? "s have" : " has"} no Open Graph image — social share previews will lack a thumbnail.`,
      count: noOgCount,
      href: "/admin/notifications",
    });
  }

  // ── Contact: critical info missing ───────────────────────────────────────────
  const c = contact[0];
  if (!c || empty(c.email) || empty(c.phone) || empty(c.addressEn)) {
    tasks.push({
      id: "contact-incomplete",
      severity: "critical",
      badge: "Required",
      title: "Contact Information Incomplete",
      description: "Email, phone, or address is missing from contact settings.",
      count: 1,
      href: "/admin/contact",
    });
  }

  return tasks;
}

/** Total count of task items — used for the sidebar/header badge. */
export async function getNotificationCount(): Promise<number> {
  const tasks = await getNotificationTasks();
  return tasks.length;
}

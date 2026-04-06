import { getPageBySlug } from "@/lib/actions/pages";
import { notFound } from "next/navigation";
import LegalPage from "@/screens/LegalPage";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const page = await getPageBySlug("services");
  if (!page) notFound();

  return (
    <LegalPage
      titleEn={page.titleEn}
      titleKa={page.titleKa ?? null}
      contentEn={page.contentEn ?? ""}
      contentKa={page.contentKa ?? null}
      heroImage={page.heroImage ?? null}
      ctaTextEn={page.ctaTextEn ?? null}
      ctaTextKa={page.ctaTextKa ?? null}
      ctaUrl={page.ctaUrl ?? null}
    />
  );
}

import { getPageBySlug } from "@/lib/actions/pages";
import { notFound } from "next/navigation";
import Layout from "@/components/Layout";
import { LegalPageInner } from "@/screens/LegalPage";
import CTA from "@/screens/Universal/CTA";

export const dynamic = "force-dynamic";

export default async function ServicesKa() {
  const page = await getPageBySlug("services");
  if (!page) notFound();

  return (
    <Layout>
      <LegalPageInner
        titleEn={page.titleEn}
        titleKa={page.titleKa ?? null}
        contentEn={page.contentEn ?? ""}
        contentKa={page.contentKa ?? null}
        heroImage={page.heroImage ?? null}
        hideBreadcrumb
      />
      <CTA />
    </Layout>
  );
}

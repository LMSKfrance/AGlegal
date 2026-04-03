import { getPageBySlug } from "@/lib/actions/pages";
import { notFound } from "next/navigation";
import LegalPage from "@/screens/LegalPage";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function SlugKa({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <LegalPage
      titleEn={page.titleEn}
      titleKa={page.titleKa ?? null}
      contentEn={page.contentEn ?? ""}
      contentKa={page.contentKa ?? null}
    />
  );
}

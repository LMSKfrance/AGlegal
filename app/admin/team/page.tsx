import Link from "next/link";
import { getTeamList } from "@/lib/actions/team";
import { getTeamPageContent } from "@/lib/actions/settings";
import { getPageBySlug, upsertTeamPageSeo } from "@/lib/actions/pages";
import { TeamListTable } from "./TeamListTable";
import TeamPageHeaderForm from "./TeamPageHeaderForm";
import TeamSeoForm from "./TeamSeoForm";

export const dynamic = "force-dynamic";

export default async function TeamListPage() {
  const [members, pageContent, seoPage] = await Promise.all([
    getTeamList(),
    getTeamPageContent(),
    getPageBySlug("team"),
  ]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Team Directory</h1>
          <p className="text-brand-500 mt-2">Drag <i className="ph ph-dots-six-vertical" /> to reorder. Click a name to edit.</p>
        </div>
        <Link href="/admin/team/new" className="btn btn-primary">
          <i className="ph ph-plus" /> Add Member
        </Link>
      </div>

      <div className="page-content">
        <TeamPageHeaderForm
          titleEn={pageContent.titleEn}
          titleKa={pageContent.titleKa}
          descriptionEn={pageContent.descriptionEn}
          descriptionKa={pageContent.descriptionKa}
        />

        <div className="card overflow-hidden">
          {members.length === 0 ? (
            <div className="text-center text-brand-400 py-12">
              No team members yet.{" "}
              <Link href="/admin/team/new" className="text-primary-600 font-medium hover:underline">
                Add the first one →
              </Link>
            </div>
          ) : (
            <div className="table-container">
              <TeamListTable initialMembers={members} />
            </div>
          )}
        </div>

        <TeamSeoForm page={seoPage} saveAction={upsertTeamPageSeo} />
      </div>
    </>
  );
}

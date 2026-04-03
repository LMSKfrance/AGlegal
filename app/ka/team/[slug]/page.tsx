import { getTeamMemberBySlug, getOtherTeamMembers } from "@/lib/team";
import MemberDetailPage from "@/screens/MemberDetail";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

const TeamMemberKa = async ({ params }: Props) => {
  const { slug } = await params;
  const [memberEn, memberKa, otherMembersEn, otherMembersKa] = await Promise.all([
    getTeamMemberBySlug(slug, "en"),
    getTeamMemberBySlug(slug, "ka"),
    getOtherTeamMembers(slug, "en"),
    getOtherTeamMembers(slug, "ka"),
  ]);

  if (!memberEn) {
    notFound();
  }

  return <MemberDetailPage memberEn={memberEn} memberKa={memberKa} otherMembersEn={otherMembersEn} otherMembersKa={otherMembersKa} />;
};

export default TeamMemberKa;

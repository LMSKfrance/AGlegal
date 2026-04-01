import { getTeamMemberBySlug, getOtherTeamMembers } from "@/lib/team";
import MemberDetailPage from "@/screens/MemberDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);
  if (!member) return { title: "Team Member" };
  return {
    title: `${member.title} | AG Legal`,
    description: member.description,
    openGraph: {
      title: `${member.title} | AG Legal`,
      description: member.description,
      images: (member.ogImage ?? member.image) ? [{ url: (member.ogImage ?? member.image)!, alt: member.title }] : [],
    },
  };
}

const TeamMemberPage = async ({ params }: Props) => {
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

export default TeamMemberPage;

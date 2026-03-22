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
  const member = await getTeamMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const otherMembers = await getOtherTeamMembers(slug);

  return <MemberDetailPage member={member} otherMembers={otherMembers} />;
};

export default TeamMemberPage;

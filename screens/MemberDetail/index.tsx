import Layout from "@/components/Layout";
import CTA from "@/screens/Universal/CTA";
import Hero from "./Hero";
import type { TeamMember } from "@/lib/types/team";

type MemberDetailPageProps = {
  memberEn: TeamMember;
  memberKa: TeamMember | null;
  otherMembersEn: TeamMember[];
  otherMembersKa: TeamMember[];
};

const MemberDetailPage = ({ memberEn, memberKa, otherMembersEn, otherMembersKa }: MemberDetailPageProps) => {
  return (
    <Layout>
      <Hero memberEn={memberEn} memberKa={memberKa} otherMembersEn={otherMembersEn} otherMembersKa={otherMembersKa} />
      <CTA />
    </Layout>
  );
};

export default MemberDetailPage;

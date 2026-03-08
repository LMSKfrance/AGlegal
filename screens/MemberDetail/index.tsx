import Layout from "@/components/Layout";
import CTA from "@/screens/Universal/CTA";
import Hero from "./Hero";
import type { TeamMember } from "@/lib/types/team";

type MemberDetailPageProps = {
  member: TeamMember;
  otherMembers: TeamMember[];
};

const MemberDetailPage = ({ member, otherMembers }: MemberDetailPageProps) => {
  return (
    <Layout>
      <Hero member={member} otherMembers={otherMembers} />
      <CTA />
    </Layout>
  );
};

export default MemberDetailPage;

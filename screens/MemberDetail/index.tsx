import Layout from "@/components/Layout";
import CTA from "@/screens/Universal/CTA";
import Hero from "./Hero";

type MemberType = {
  id: number;
  slug: string;
  title: string;
  position: string;
  description: string;
  quote: string;
  text1: string;
  text2: string;
  image: string;
  socials: {
    id: number;
    name: string;
    icon: React.ReactNode;
    link: string;
  }[];
};

type MemberDetailPageProps = {
  member: MemberType;
  otherMembers: MemberType[];
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

import mock from "@/constants/mock";
import MemberDetailPage from "@/screens/MemberDetail";

const MemberDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const member = mock.members.find((m) => m.slug === slug);

  if (!member) {
    return null;
  }

  const otherMembers = mock.members.filter((m) => m.slug !== slug);

  return <MemberDetailPage member={member} otherMembers={otherMembers} />;
};

export default MemberDetail;

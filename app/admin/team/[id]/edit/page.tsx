import { notFound } from "next/navigation";
import { getTeamMemberById, updateTeamMember } from "@/lib/actions/team";
import TeamForm from "../../TeamForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditTeamMemberPage({ params }: Props) {
  const { id } = await params;
  const member = await getTeamMemberById(Number(id));
  if (!member) notFound();

  const action = updateTeamMember.bind(null, member.id);
  return <TeamForm action={action} member={member} />;
}

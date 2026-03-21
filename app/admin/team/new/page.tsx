import { createTeamMember } from "@/lib/actions/team";
import TeamForm from "../TeamForm";

export default function NewTeamMemberPage() {
  return <TeamForm action={createTeamMember} />;
}

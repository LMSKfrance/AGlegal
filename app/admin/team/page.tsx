import Link from "next/link";
import { getTeamList, deleteTeamMember } from "@/lib/actions/team";
import { DeleteButton } from "@/app/admin/_components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function TeamListPage() {
  const members = await getTeamList();

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Team Directory</h1>
        </div>
        <Link href="/admin/team/new" className="btn btn-primary">
          <i className="ph ph-plus" /> Add Member
        </Link>
      </div>

      <div className="page-content">
        <div className="card overflow-hidden">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="hidden sm:table-cell w-16" />
                  <th>Name</th>
                  <th>Position</th>
                  <th className="hidden sm:table-cell text-center w-24">Homepage</th>
                  <th className="hidden sm:table-cell text-center w-20">Order</th>
                  <th className="text-right w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-brand-400 py-12">
                      No team members yet. <Link href="/admin/team/new" className="text-primary-600 font-medium hover:underline">Add the first one →</Link>
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member.id}>
                      <td className="hidden sm:table-cell">
                        {member.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/api/images/${member.image}`}
                            alt={member.titleEn}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-400">
                            <i className="ph ph-user" />
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="font-medium text-brand-900">{member.titleEn}</div>
                        {member.titleKa && <div className="text-[12px] text-brand-400 mt-0.5">{member.titleKa}</div>}
                      </td>
                      <td className="text-brand-600 text-[13px]">{member.positionEn ?? <span className="text-brand-300">—</span>}</td>
                      <td className="hidden sm:table-cell text-center">
                        {member.showOnHome ? (
                          <span className="badge badge-green text-[11px]">Yes</span>
                        ) : (
                          <span className="text-brand-300 text-[12px]">No</span>
                        )}
                      </td>
                      <td className="hidden sm:table-cell text-center text-brand-500 text-[13px]">{member.homeOrder}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/team/${member.id}/edit`} className="btn-icon" title="Edit">
                            <i className="ph ph-pencil text-brand-500" />
                          </Link>
                          <DeleteButton action={deleteTeamMember.bind(null, member.id)} label={member.titleEn} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

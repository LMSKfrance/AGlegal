import { auth, signOut } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Admin</h1>
      <p className="text-neutral-600 mb-4">
        You&apos;re logged in.
        {session?.user?.email && (
          <span className="ml-1">({session.user.email})</span>
        )}
      </p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/admin/login" });
        }}
      >
        <button
          type="submit"
          className="rounded bg-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-300"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

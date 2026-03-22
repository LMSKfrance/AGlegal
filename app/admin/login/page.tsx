import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Script from "next/script";
import "../admin-shell.css";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  async function handleLogin(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/admin",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/admin/login?error=1");
      }
      throw error;
    }
  }

  return (
    <>
      <Script src="https://unpkg.com/@phosphor-icons/web" strategy="beforeInteractive" />
      <div className="admin-shell-root flex h-screen w-screen items-center justify-center bg-brand-50">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-bold text-brand-900">AG Legal CMS</h1>
            <p className="text-brand-500 mt-1">Sign in to admin panel</p>
          </div>

          {params.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              Invalid username or password.
            </div>
          )}

          <form action={handleLogin} className="space-y-5">
            <div>
              <label className="label-base required">Username</label>
              <input type="text" name="email" className="input-base" placeholder="Administrator" required />
            </div>
            <div>
              <label className="label-base required">Password</label>
              <input type="password" name="password" className="input-base" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary w-full !h-11 mt-4 text-sm">
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-brand-400">
            Secured by NextAuth.js credentials
          </div>
        </div>
      </div>
    </>
  );
}

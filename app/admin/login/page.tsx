import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import Script from "next/script";
import "../admin-shell.css";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  async function handleLogin(formData: FormData) {
    "use server";
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (result?.error) {
      redirect("/admin/login?error=1");
    } else {
      redirect("/admin");
    }
  }

  return (
    <>
      <Script src="https://unpkg.com/@phosphor-icons/web" strategy="beforeInteractive" />
      <div className="admin-shell-root flex h-screen w-screen items-center justify-center bg-brand-50">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <i className="ph-fill ph-scales text-primary-600 text-5xl mb-4" />
            <h1 className="text-2xl font-bold text-brand-900">AG Legal CMS</h1>
            <p className="text-brand-500 mt-1">Sign in to admin panel</p>
          </div>

          {searchParams.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              Invalid email or password.
            </div>
          )}

          <form action={handleLogin} className="space-y-5">
            <div>
              <label className="label-base required">Email Address</label>
              <input type="email" name="email" className="input-base" placeholder="admin@aglegal.com" required />
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

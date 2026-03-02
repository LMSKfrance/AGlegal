import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { Button, TextField } from "@/design-system";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/admin");
  }

  const { callbackUrl, error } = await searchParams;

  async function handleLogin(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl ?? "/admin",
      });
    } catch {
      redirect("/admin/login?error=CredentialsSignin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--gray-50)] p-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-[var(--gray-900)] mb-6">
          Admin login
        </h1>
        <form action={handleLogin} className="space-y-4">
          {error && (
            <p className="text-sm text-[var(--red-600)]" role="alert">
              Invalid credentials.
            </p>
          )}
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            size="m"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            size="m"
          />
          <Button type="submit" fullWidth variant="primary" colorStyle="dark" size="m">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}

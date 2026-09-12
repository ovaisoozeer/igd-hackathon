import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/ui/login-form";
import { SiteHeader } from "@/app/ui/site-header";
import { getCurrentUser } from "@/lib/session";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-full flex-col bg-[var(--paper)]">
      <SiteHeader user={user} />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-12">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
          Welcome back
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">
          Sign in to AttrAct.
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Use the email and password from your account. Your role is already
          saved.
        </p>
        <div className="mt-8 rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8">
          <LoginForm />
        </div>
        <p className="mt-6 text-sm text-[var(--muted)]">
          New here?{" "}
          <Link href="/signup" className="text-[var(--ink)] underline">
            Create an account
          </Link>
        </p>
      </main>
    </div>
  );
}

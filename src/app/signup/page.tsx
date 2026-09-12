import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/app/ui/signup-form";
import { SiteHeader } from "@/app/ui/site-header";
import { dashboardPath } from "@/lib/routes";
import { getCurrentUser } from "@/lib/session";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(dashboardPath(user.role));
  }

  return (
    <div className="flex min-h-full flex-col bg-[var(--paper)]">
      <SiteHeader user={user} />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-12">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
          Create your account
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">
          Join as a candidate or provider.
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Your role is stored with the account and used to render the right
          dashboard on the server.
        </p>
        <div className="mt-8 rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8">
          <SignupForm />
        </div>
        <p className="mt-6 text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--ink)] underline">
            Log in
          </Link>
        </p>
      </main>
    </div>
  );
}

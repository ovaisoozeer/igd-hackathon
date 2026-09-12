import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/app/ui/site-header";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "PROVIDER") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-full flex-col bg-[var(--paper)]">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <Link href="/dashboard" className="text-[var(--accent)]">
          Back to dashboard
        </Link>
        <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
          Applications
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Incoming applications from candidates will appear here.
        </p>
      </main>
    </div>
  );
}

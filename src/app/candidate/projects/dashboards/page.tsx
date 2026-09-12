import Link from "next/link";
import { redirect } from "next/navigation";
import { IndustryPicker } from "@/app/ui/industry-picker";
import { SiteHeader } from "@/app/ui/site-header";
import { dashboardPath } from "@/lib/routes";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CandidateProjectsDashboardsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "CANDIDATE") {
    redirect(dashboardPath(user.role));
  }

  return (
    <div className="flex min-h-full flex-col bg-[var(--paper)]">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <Link href="/candidate/dashboard" className="text-[var(--accent)]">
          Back to dashboard
        </Link>
        <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
          Projects
        </h1>
        <div className="mt-6">
          {user.projectIndustry && (
            <p className="mb-6 text-lg text-[var(--muted)]">
              Current focus:{" "}
              <span className="font-medium text-[var(--ink)]">
                {user.projectIndustry}
              </span>
            </p>
          )}
          <IndustryPicker selected={user.projectIndustry} />
        </div>
      </main>
    </div>
  );
}

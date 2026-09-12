import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/app/ui/site-header";
import { dashboardPath } from "@/lib/routes";
import { getCurrentUser } from "@/lib/session";
import { getShortlistedOpportunities } from "@/lib/submissions";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "CANDIDATE") {
    redirect(dashboardPath(user.role));
  }

  const opportunities = await getShortlistedOpportunities(user.id);

  return (
    <div className="flex min-h-full flex-col bg-[var(--paper)]">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <Link href="/candidate/dashboard" className="text-[var(--accent)]">
          Back to dashboard
        </Link>
        <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
          Opportunities
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Projects you have been shortlisted for, and the provider behind each
          one.
        </p>

        <section className="mt-10">
          {opportunities.length === 0 ? (
            <p className="mt-4 text-[var(--muted)]">
              You have not been shortlisted for any projects yet.
            </p>
          ) : (
            <ul className="mt-6 grid gap-4">
              {opportunities.map((opportunity) => (
                <li
                  key={opportunity.id}
                  className="rounded-3xl border border-[var(--line)] bg-white p-6"
                >
                  <p className="text-sm font-medium text-[var(--accent)]">
                    {opportunity.project.industry}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Provider: {opportunity.project.provider.name}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap leading-7 text-[var(--ink)]">
                    {opportunity.project.brief}
                  </p>
                  <div className="mt-5">
                    <Link
                      href={`/candidate/projects/${opportunity.project.id}`}
                      className="btn-secondary"
                    >
                      View submission
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

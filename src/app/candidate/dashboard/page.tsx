import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/app/ui/site-header";
import { dashboardPath } from "@/lib/routes";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

const cards = [
  {
    title: "Profile",
    body: "Keep a single introduction that providers can read before they reach out.",
  },
  {
    title: "Opportunities",
    body: "See projects you have been shortlisted for, along with the provider.",
  },
  {
    title: "Applications",
    body: "Track conversations you have started without leaving the dashboard.",
  },
] as const;

export default async function CandidateDashboardPage() {
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
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
          Candidate dashboard
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
          Your search starts here.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Welcome, {user.name}. This page is rendered on the server from your
          session, so the first HTML response already knows you are a
          candidate.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/candidate/projects/dashboards" className="btn-primary">
            Projects
          </Link>
          <Link href="/dashboard/opportunities" className="btn-secondary">
            Opportunities
          </Link>
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-[var(--line)] bg-white p-6"
            >
              <h2 className="font-serif text-2xl">{card.title}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{card.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

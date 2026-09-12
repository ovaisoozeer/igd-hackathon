import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/app/ui/site-header";
import { getCurrentUser, isCharityProvider } from "@/lib/session";

export const dynamic = "force-dynamic";

const roleCopy = {
  CANDIDATE: {
    label: "Candidate",
    headline: "Your search starts here.",
    cards: [
      {
        title: "Profile",
        body: "Keep a single introduction that providers can read before they reach out.",
      },
      {
        title: "Opportunities",
        body: "This is where open roles from providers will appear in a later iteration.",
      },
      {
        title: "Applications",
        body: "Track conversations you have started without leaving the dashboard.",
      },
    ],
  },
  PROVIDER: {
    label: "Provider",
    headline: "Your bench starts here.",
    cards: [
      {
        title: "Listings",
        body: "Publish the work you need filled. Candidates will see these after they sign up.",
      },
      {
        title: "Inbox",
        body: "Review people who opted in as candidates and keep the first reply in one place.",
      },
      {
        title: "Team",
        body: "Invite collaborators later without changing the account model.",
      },
    ],
  },
} as const;

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const content = roleCopy[user.role];
  const isCharity = isCharityProvider(user);

  return (
    <div className="flex min-h-full flex-col bg-[var(--paper)]">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
          {isCharity ? "Charity" : content.label} dashboard
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
          {content.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Welcome, {user.name}. This page is rendered on the server from your
          session, so the first HTML response already knows you are a{" "}
          {content.label.toLowerCase()}.
        </p>

        {user.role === "CANDIDATE" && (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard/projects" className="btn-primary">
              Projects
            </Link>
            <Link href="/dashboard/opportunities" className="btn-secondary">
              Opportunities
            </Link>
          </div>
        )}

        {user.role === "PROVIDER" && (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard/projects" className="btn-primary">
              Projects
            </Link>
            <Link href="/dashboard/applications" className="btn-secondary">
              Applications
            </Link>
            {isCharity && (
              <Link href="/dashboard/my-projects" className="btn-secondary">
                My Projects
              </Link>
            )}
          </div>
        )}

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {content.cards.map((card) => (
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

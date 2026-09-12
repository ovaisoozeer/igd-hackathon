import Link from "next/link";
import { SiteHeader } from "@/app/ui/site-header";
import { getCurrentUser } from "@/lib/session";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-col bg-[var(--paper)]">
      <SiteHeader user={user} />

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-24">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
              Candidate and provider marketplace
            </p>
            <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[1.05] tracking-tight text-[var(--ink)] sm:text-6xl">
              A quieter way to find work, or find people.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[var(--muted)]">
              Harbor is a starting template for matching two sides of a
              marketplace. Sign up as a candidate looking for opportunities, or
              as a provider offering them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary">
                Create an account
              </Link>
              <Link href="/login" className="btn-secondary">
                I already have one
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-3xl bg-[var(--ink)] p-7 text-[var(--paper)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--paper-dim)]">
                For candidates
              </p>
              <h2 className="mt-3 font-serif text-3xl">Show up ready.</h2>
              <p className="mt-3 text-[var(--paper-dim)]">
                Keep a single profile, browse openings, and apply without
                rebuilding your story for every provider.
              </p>
            </article>
            <article className="rounded-3xl bg-[var(--sand)] p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                For providers
              </p>
              <h2 className="mt-3 font-serif text-3xl">Hire with context.</h2>
              <p className="mt-3 text-[var(--muted)]">
                Publish roles, review people who opted in, and keep the first
                conversation on the work itself.
              </p>
            </article>
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-[var(--sand)]/60">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choose a side",
                copy: "During signup, pick candidate or provider. That choice shapes the dashboard you land in.",
              },
              {
                step: "02",
                title: "Create an account",
                copy: "Email and password auth runs on the server. Sessions are stored in a signed httpOnly cookie.",
              },
              {
                step: "03",
                title: "Work from the dashboard",
                copy: "The dashboard is rendered on the server from the current session, so role-specific content is ready on first paint.",
              },
            ].map((item) => (
              <article key={item.step}>
                <p className="font-serif text-3xl text-[var(--accent)]">
                  {item.step}
                </p>
                <h2 className="mt-3 font-serif text-2xl">{item.title}</h2>
                <p className="mt-2 leading-7 text-[var(--muted)]">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-[var(--ink)] text-[var(--paper-dim)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-lg text-[var(--paper)]">Harbor</p>
          <p className="text-sm">
            Next.js template with server-side rendering and role-based signup.
          </p>
        </div>
      </footer>
    </div>
  );
}

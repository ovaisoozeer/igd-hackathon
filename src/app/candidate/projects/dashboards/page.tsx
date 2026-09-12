import Link from "next/link";
import { redirect } from "next/navigation";
import { IndustryPicker } from "@/app/ui/industry-picker";
import { SiteHeader } from "@/app/ui/site-header";
import { SubmissionRating } from "@/app/ui/submission-rating";
import { prisma } from "@/lib/prisma";
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

  const projects = user.projectIndustry
    ? await prisma.project.findMany({
        where: { industry: user.projectIndustry },
        include: {
          provider: { select: { name: true } },
          submissions: {
            where: { candidateId: user.id },
            select: { id: true, rating: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

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

        {user.projectIndustry && (
          <section className="mt-12">
            <h2 className="font-serif text-3xl tracking-tight">
              {user.projectIndustry} projects
            </h2>
            {projects.length === 0 ? (
              <p className="mt-4 text-[var(--muted)]">
                No projects in this industry yet. Choose another industry, or
                check back later.
              </p>
            ) : (
              <ul className="mt-6 grid gap-4">
                {projects.map((project) => {
                  const submission = project.submissions[0];
                  const hasSubmitted = Boolean(submission);

                  return (
                    <li
                      key={project.id}
                      className="rounded-3xl border border-[var(--line)] bg-white p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm text-[var(--muted)]">
                          From {project.provider.name}
                        </p>
                        {submission?.rating != null && (
                          <SubmissionRating rating={submission.rating} />
                        )}
                      </div>
                      <p className="mt-3 whitespace-pre-wrap leading-7 text-[var(--ink)]">
                        {project.brief}
                      </p>
                      <div className="mt-5">
                        {hasSubmitted ? (
                          <Link
                            href={`/candidate/projects/${project.id}`}
                            className="btn-secondary"
                          >
                            View submission
                          </Link>
                        ) : (
                          <Link
                            href={`/candidate/projects/${project.id}`}
                            className="btn-primary"
                          >
                            Select project
                          </Link>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/app/ui/site-header";
import { SubmissionRating } from "@/app/ui/submission-rating";
import { prisma } from "@/lib/prisma";
import { dashboardPath } from "@/lib/routes";
import { getCurrentUser } from "@/lib/session";
import { getTopRatedSubmissions } from "@/lib/submissions";

export const dynamic = "force-dynamic";

export default async function ProviderProjectSubmissionsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "PROVIDER") {
    redirect(dashboardPath(user.role));
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      provider: { select: { name: true } },
    },
  });

  if (!project) {
    notFound();
  }

  const submissions = await getTopRatedSubmissions(project.id);

  return (
    <div className="flex min-h-full flex-col bg-[var(--paper)]">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <Link href="/provider/projects" className="text-[var(--accent)]">
          Back to projects
        </Link>
        <p className="mt-6 text-sm font-medium text-[var(--accent)]">
          {project.industry}
        </p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">
          Top submissions
        </h1>
        <p className="mt-2 text-[var(--muted)]">From {project.provider.name}</p>
        <article className="mt-8 rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8">
          <p className="whitespace-pre-wrap leading-7 text-[var(--ink)]">
            {project.brief}
          </p>
        </article>

        <section className="mt-10">
          <h2 className="font-serif text-2xl">Highest rated</h2>
          {submissions.length === 0 ? (
            <p className="mt-4 text-[var(--muted)]">
              No rated submissions yet. Check back after candidates apply.
            </p>
          ) : (
            <ol className="mt-6 grid gap-4">
              {submissions.map((submission, index) => (
                <li
                  key={submission.id}
                  className="rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--accent)]">
                        Rank {index + 1}
                      </p>
                      <h3 className="mt-1 font-serif text-2xl">
                        {submission.candidate.name}
                      </h3>
                    </div>
                    {submission.rating != null && (
                      <SubmissionRating rating={submission.rating} />
                    )}
                  </div>
                  <p className="mt-6 whitespace-pre-wrap leading-7 text-[var(--ink)]">
                    {submission.content}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  );
}

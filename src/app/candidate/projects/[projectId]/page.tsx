import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CreateSubmissionForm } from "@/app/ui/create-submission-form";
import { SiteHeader } from "@/app/ui/site-header";
import { prisma } from "@/lib/prisma";
import { dashboardPath } from "@/lib/routes";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CandidateProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "CANDIDATE") {
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

  const submission = await prisma.submission.findUnique({
    where: {
      candidateId_projectId: {
        candidateId: user.id,
        projectId: project.id,
      },
    },
  });

  return (
    <div className="flex min-h-full flex-col bg-[var(--paper)]">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <Link
          href="/candidate/projects/dashboards"
          className="text-[var(--accent)]"
        >
          Back to projects
        </Link>
        <p className="mt-6 text-sm font-medium text-[var(--accent)]">
          {project.industry}
        </p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">
          Project brief
        </h1>
        <p className="mt-2 text-[var(--muted)]">From {project.provider.name}</p>
        <article className="mt-8 rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8">
          <p className="whitespace-pre-wrap leading-7 text-[var(--ink)]">
            {project.brief}
          </p>
        </article>

        <section className="mt-10">
          <h2 className="font-serif text-2xl">Your submission</h2>
          {submission ? (
            <article className="mt-6 rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8">
              <p className="whitespace-pre-wrap leading-7 text-[var(--ink)]">
                {submission.content}
              </p>
              <div className="mt-6">
                <Link
                  href={`/candidate/projects/${project.id}/upload`}
                  className="btn-primary"
                >
                  Review
                </Link>
              </div>
              {submission.evaluation && (
                <div className="mt-8 border-t border-[var(--line)] pt-6">
                  <p className="text-sm font-medium text-[var(--accent)]">
                    Saved evaluation
                  </p>
                  <div className="mt-3 space-y-4 leading-7 text-[var(--ink)]">
                    {submission.evaluation.split("\n\n").map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ) : (
            <div className="mt-6 rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8">
              <CreateSubmissionForm projectId={project.id} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

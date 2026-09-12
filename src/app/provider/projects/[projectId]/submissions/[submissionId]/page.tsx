import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ShortlistButton } from "@/app/ui/shortlist-button";
import { SiteHeader } from "@/app/ui/site-header";
import { SubmissionRating } from "@/app/ui/submission-rating";
import { dashboardPath } from "@/lib/routes";
import { getCurrentUser } from "@/lib/session";
import { getProjectSubmission } from "@/lib/submissions";

export const dynamic = "force-dynamic";

export default async function ProviderSubmissionDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string; submissionId: string }>;
}) {
  const { projectId, submissionId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "PROVIDER") {
    redirect(dashboardPath(user.role));
  }

  const submission = await getProjectSubmission(projectId, submissionId);

  if (!submission) {
    notFound();
  }

  const { project } = submission;

  return (
    <div className="flex min-h-full flex-col bg-[var(--paper)]">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <Link
          href={`/provider/projects/${project.id}`}
          className="text-[var(--accent)]"
        >
          Back to submissions
        </Link>
        <p className="mt-6 text-sm font-medium text-[var(--accent)]">
          {project.industry}
        </p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">
          {submission.candidate.name}
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Submission for a project from {project.provider.name}
        </p>
        <div className="mt-6">
          <ShortlistButton
            projectId={project.id}
            submissionId={submission.id}
            shortlisted={submission.shortlisted}
          />
        </div>

        {submission.rating != null && (
          <div className="mt-8">
            <SubmissionRating rating={submission.rating} size="lg" />
          </div>
        )}

        <section className="mt-10">
          <h2 className="font-serif text-2xl">Submission</h2>
          <article className="mt-6 rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8">
            <p className="whitespace-pre-wrap leading-7 text-[var(--ink)]">
              {submission.content}
            </p>
          </article>
        </section>

        {submission.evaluation && (
          <section className="mt-10">
            <h2 className="font-serif text-2xl">Assessment</h2>
            <article className="mt-6 rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8">
              <p className="text-sm font-medium text-[var(--accent)]">
                How well this met the brief
              </p>
              <div className="mt-4 space-y-4 leading-7 text-[var(--ink)]">
                {submission.evaluation.split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          </section>
        )}

        <section className="mt-10">
          <h2 className="font-serif text-2xl">Project brief</h2>
          <article className="mt-6 rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8">
            <p className="whitespace-pre-wrap leading-7 text-[var(--ink)]">
              {project.brief}
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}

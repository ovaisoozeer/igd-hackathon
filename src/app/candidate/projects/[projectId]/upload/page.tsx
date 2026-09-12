import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/app/ui/site-header";
import { SubmissionReview } from "@/app/ui/submission-review";
import { prisma } from "@/lib/prisma";
import { dashboardPath } from "@/lib/routes";
import { getCurrentUser } from "@/lib/session";
import { ensureSubmissionEvaluation } from "@/lib/submissions";

export const dynamic = "force-dynamic";

export default async function CandidateSubmissionUploadPage({
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
    select: { id: true, industry: true },
  });

  if (!project) {
    notFound();
  }

  const result = await ensureSubmissionEvaluation(user.id, project.id);

  if (!result) {
    redirect(`/candidate/projects/${project.id}`);
  }

  return (
    <div className="flex min-h-full flex-col bg-[var(--paper)]">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <Link
          href={`/candidate/projects/${project.id}`}
          className="text-[var(--accent)]"
        >
          Back to submission
        </Link>
        <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
          Upload review
        </h1>
        <p className="mt-3 text-[var(--muted)]">{project.industry}</p>
        <div className="mt-10">
          <SubmissionReview
            evaluation={result.evaluation}
            rating={result.rating}
            delay={result.isNew}
          />
        </div>
      </main>
    </div>
  );
}

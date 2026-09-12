import { SAMPLE_EVALUATION, randomSubmissionRating } from "@/lib/evaluation";
import { prisma } from "@/lib/prisma";

export async function ensureSubmissionEvaluation(
  candidateId: string,
  projectId: string,
) {
  const submission = await prisma.submission.findUnique({
    where: {
      candidateId_projectId: {
        candidateId,
        projectId,
      },
    },
  });

  if (!submission) {
    return null;
  }

  if (submission.evaluation && submission.rating != null) {
    return {
      evaluation: submission.evaluation,
      rating: submission.rating,
      isNew: false,
    };
  }

  const evaluation = submission.evaluation ?? SAMPLE_EVALUATION;
  const rating = submission.rating ?? randomSubmissionRating();
  const updated = await prisma.submission.update({
    where: { id: submission.id },
    data: {
      ...(!submission.evaluation ? { evaluation } : {}),
      ...(submission.rating == null ? { rating } : {}),
    },
  });

  return {
    evaluation: updated.evaluation ?? evaluation,
    rating: updated.rating ?? rating,
    isNew: !submission.evaluation,
  };
}

export async function getTopRatedSubmissions(projectId: string, limit = 5) {
  return prisma.submission.findMany({
    where: {
      projectId,
      rating: { not: null },
    },
    include: {
      candidate: { select: { name: true } },
    },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

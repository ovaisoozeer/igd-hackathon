import { SAMPLE_EVALUATION } from "@/lib/evaluation";
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

  if (submission.evaluation) {
    return { evaluation: submission.evaluation, isNew: false };
  }

  const updated = await prisma.submission.update({
    where: { id: submission.id },
    data: { evaluation: SAMPLE_EVALUATION },
  });

  return { evaluation: updated.evaluation ?? SAMPLE_EVALUATION, isNew: true };
}

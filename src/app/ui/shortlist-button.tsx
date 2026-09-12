"use client";

import { useFormStatus } from "react-dom";
import { shortlistSubmission } from "@/app/actions/projects";

type ShortlistButtonProps = {
  projectId: string;
  submissionId: string;
  shortlisted: boolean;
};

function ShortlistSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "Shortlisting..." : "Shortlist candidate"}
    </button>
  );
}

export function ShortlistButton({
  projectId,
  submissionId,
  shortlisted,
}: ShortlistButtonProps) {
  if (shortlisted) {
    return (
      <p className="text-sm font-medium text-[var(--accent)]">
        Shortlisted for this opportunity
      </p>
    );
  }

  return (
    <form action={shortlistSubmission}>
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="submissionId" value={submissionId} />
      <ShortlistSubmitButton />
    </form>
  );
}

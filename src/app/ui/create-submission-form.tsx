"use client";

import { useActionState } from "react";
import { createSubmission } from "@/app/actions/projects";

type CreateSubmissionFormProps = {
  projectId: string;
};

export function CreateSubmissionForm({ projectId }: CreateSubmissionFormProps) {
  const [state, action, pending] = useActionState(createSubmission, undefined);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="projectId" value={projectId} />
      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Your submission
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          placeholder="Explain how you would approach this brief."
          className="field min-h-48 resize-y"
        />
        {state?.errors?.content && (
          <p className="text-sm text-[var(--accent)]">
            {state.errors.content[0]}
          </p>
        )}
      </div>

      {state?.message && (
        <p className="text-sm text-[var(--accent)]">{state.message}</p>
      )}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Sending..." : "Create submission"}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { createProject } from "@/app/actions/projects";
import { INDUSTRIES } from "@/lib/industries";

export function CreateProjectForm() {
  const [state, action, pending] = useActionState(createProject, undefined);

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="industry" className="text-sm font-medium">
          Industry
        </label>
        <select id="industry" name="industry" defaultValue="" className="field">
          <option value="" disabled>
            Choose an industry
          </option>
          {INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        {state?.errors?.industry && (
          <p className="text-sm text-[var(--accent)]">
            {state.errors.industry[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="brief" className="text-sm font-medium">
          Brief
        </label>
        <textarea
          id="brief"
          name="brief"
          rows={6}
          placeholder="Describe the project in a few sentences."
          className="field min-h-40 resize-y"
        />
        {state?.errors?.brief && (
          <p className="text-sm text-[var(--accent)]">{state.errors.brief[0]}</p>
        )}
      </div>

      {state?.message && (
        <p className="text-sm text-[var(--accent)]">{state.message}</p>
      )}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Uploading..." : "Upload project"}
      </button>
    </form>
  );
}

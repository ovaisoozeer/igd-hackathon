"use client";

import { useActionState, useState } from "react";
import { signup } from "@/app/actions/auth";
import type { Role } from "@/lib/definitions";

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);
  const [role, setRole] = useState<Role>("CANDIDATE");

  return (
    <form action={action} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-[var(--ink)]">
          I am joining as
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="role-card">
            <input
              type="radio"
              name="role"
              value="CANDIDATE"
              className="peer sr-only"
              checked={role === "CANDIDATE"}
              onChange={() => setRole("CANDIDATE")}
            />
            <span className="role-card-surface">
              <span className="font-serif text-xl">Candidate</span>
              <span className="mt-1 block text-sm text-[var(--muted)]">
                Find roles, share your profile, and apply.
              </span>
            </span>
          </label>
          <label className="role-card">
            <input
              type="radio"
              name="role"
              value="PROVIDER"
              className="peer sr-only"
              checked={role === "PROVIDER"}
              onChange={() => setRole("PROVIDER")}
            />
            <span className="role-card-surface">
              <span className="font-serif text-xl">Provider</span>
              <span className="mt-1 block text-sm text-[var(--muted)]">
                Post opportunities and review candidates.
              </span>
            </span>
          </label>
        </div>
        {state?.errors?.role && (
          <p className="text-sm text-[var(--accent)]">{state.errors.role[0]}</p>
        )}
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          className="field"
        />
        {state?.errors?.name && (
          <p className="text-sm text-[var(--accent)]">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="field"
        />
        {state?.errors?.email && (
          <p className="text-sm text-[var(--accent)]">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className="field"
        />
        {state?.errors?.password && (
          <div className="text-sm text-[var(--accent)]">
            <p>Password must:</p>
            <ul className="list-disc pl-5">
              {state.errors.password.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {role === "PROVIDER" && (
        <div className="space-y-2">
          <label htmlFor="charityRegistrationNumber" className="text-sm font-medium">
            Charity registration number
          </label>
          <input
            id="charityRegistrationNumber"
            name="charityRegistrationNumber"
            type="text"
            autoComplete="off"
            placeholder="Optional"
            className="field"
          />
          <p className="text-sm text-[var(--muted)]">
            Add this if you are registering as a charity. Only charities can
            create projects.
          </p>
          {state?.errors?.charityRegistrationNumber && (
            <p className="text-sm text-[var(--accent)]">
              {state.errors.charityRegistrationNumber[0]}
            </p>
          )}
        </div>
      )}

      {state?.message && (
        <p className="text-sm text-[var(--accent)]">{state.message}</p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

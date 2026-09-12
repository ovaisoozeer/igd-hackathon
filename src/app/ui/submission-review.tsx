"use client";

import { useEffect, useState } from "react";

type SubmissionReviewProps = {
  evaluation: string;
  delay?: boolean;
};

export function SubmissionReview({
  evaluation,
  delay = false,
}: SubmissionReviewProps) {
  const [ready, setReady] = useState(!delay);

  useEffect(() => {
    if (!delay) {
      return;
    }

    const timeout = window.setTimeout(() => setReady(true), 5000);
    return () => window.clearTimeout(timeout);
  }, [delay]);

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="loader" aria-hidden />
        <p className="mt-6 text-[var(--muted)]">Reviewing your submission…</p>
      </div>
    );
  }

  return (
    <article className="rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8">
      <p className="text-sm font-medium text-[var(--accent)]">Assessment</p>
      <h2 className="mt-2 font-serif text-3xl tracking-tight">
        How well this met the brief
      </h2>
      <div className="mt-6 space-y-4 leading-7 text-[var(--ink)]">
        {evaluation.split("\n\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

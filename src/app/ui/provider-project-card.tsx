import Link from "next/link";

type ProviderProjectCardProps = {
  project: {
    id: string;
    brief: string;
    industry: string;
    provider: { name: string };
  };
  showProvider?: boolean;
};

export function ProviderProjectCard({
  project,
  showProvider = true,
}: ProviderProjectCardProps) {
  return (
    <li className="rounded-3xl border border-[var(--line)] bg-white p-6">
      <p className="text-sm font-medium text-[var(--accent)]">
        {project.industry}
      </p>
      {showProvider && (
        <p className="mt-2 text-sm text-[var(--muted)]">
          From {project.provider.name}
        </p>
      )}
      <p className="mt-3 whitespace-pre-wrap leading-7 text-[var(--ink)]">
        {project.brief}
      </p>
      <div className="mt-5">
        <Link
          href={`/provider/projects/${project.id}`}
          className="btn-primary"
        >
          View submissions
        </Link>
      </div>
    </li>
  );
}

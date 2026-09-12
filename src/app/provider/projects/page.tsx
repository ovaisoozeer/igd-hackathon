import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/app/ui/site-header";
import { ProviderProjectCard } from "@/app/ui/provider-project-card";
import { prisma } from "@/lib/prisma";
import { dashboardPath } from "@/lib/routes";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProviderProjectsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "PROVIDER") {
    redirect(dashboardPath(user.role));
  }

  const projects = await prisma.project.findMany({
    include: {
      provider: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-full flex-col bg-[var(--paper)]">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <Link href="/provider/dashboard" className="text-[var(--accent)]">
          Back to dashboard
        </Link>
        <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
          Projects
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Open a project to see the five highest-rated candidate submissions.
        </p>

        <section className="mt-10">
          {projects.length === 0 ? (
            <p className="mt-4 text-[var(--muted)]">
              No projects yet. Charities can upload one from My Projects.
            </p>
          ) : (
            <ul className="mt-6 grid gap-4">
              {projects.map((project) => (
                <ProviderProjectCard key={project.id} project={project} />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { CreateProjectForm } from "@/app/ui/create-project-form";
import { ProviderProjectCard } from "@/app/ui/provider-project-card";
import { SiteHeader } from "@/app/ui/site-header";
import { prisma } from "@/lib/prisma";
import { dashboardPath } from "@/lib/routes";
import { getCurrentUser, isCharityProvider } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProviderMyProjectsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!isCharityProvider(user)) {
    redirect(dashboardPath(user.role));
  }

  const projects = await prisma.project.findMany({
    where: { providerId: user.id },
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
          My Projects
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Upload a project for registration number{" "}
          {user.charityRegistrationNumber}. Providers can then review the top
          rated submissions.
        </p>

        <div className="mt-8 rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8">
          <h2 className="font-serif text-2xl">New project</h2>
          <div className="mt-6">
            <CreateProjectForm />
          </div>
        </div>

        <section className="mt-10">
          <h2 className="font-serif text-2xl">Your projects</h2>
          {projects.length === 0 ? (
            <p className="mt-4 text-[var(--muted)]">
              No projects yet. Upload one to get started.
            </p>
          ) : (
            <ul className="mt-6 grid gap-4">
              {projects.map((project) => (
                <ProviderProjectCard
                  key={project.id}
                  project={project}
                  showProvider={false}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

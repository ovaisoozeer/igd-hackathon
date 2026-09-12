import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LegacyProjectsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "CANDIDATE") {
    redirect("/candidate/projects/dashboards");
  }

  redirect("/provider/projects");
}

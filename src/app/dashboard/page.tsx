import { redirect } from "next/navigation";
import { dashboardPath } from "@/lib/routes";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LegacyDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  redirect(dashboardPath(user.role));
}

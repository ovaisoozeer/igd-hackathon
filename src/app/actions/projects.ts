"use server";

import { revalidatePath } from "next/cache";
import { isIndustry } from "@/lib/industries";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function chooseProjectIndustry(formData: FormData) {
  const user = await getCurrentUser();

  if (!user || user.role !== "CANDIDATE") {
    return;
  }

  const industry = String(formData.get("industry") ?? "");

  if (!isIndustry(industry)) {
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { projectIndustry: industry },
  });

  revalidatePath("/candidate/projects/dashboards");
}

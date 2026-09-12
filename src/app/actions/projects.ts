"use server";

import { revalidatePath } from "next/cache";
import {
  CreateProjectSchema,
  CreateSubmissionSchema,
  type CreateProjectState,
  type CreateSubmissionState,
} from "@/lib/definitions";
import { randomSubmissionRating } from "@/lib/evaluation";
import { isIndustry } from "@/lib/industries";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isCharityProvider } from "@/lib/session";

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

export async function createProject(
  _state: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  const user = await getCurrentUser();

  if (!user || !isCharityProvider(user)) {
    return { message: "Only charities can upload projects." };
  }

  const validatedFields = CreateProjectSchema.safeParse({
    brief: formData.get("brief"),
    industry: formData.get("industry"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { brief, industry } = validatedFields.data;

  if (!isIndustry(industry)) {
    return {
      errors: { industry: ["Choose an industry from the list."] },
    };
  }

  await prisma.project.create({
    data: {
      brief,
      industry,
      providerId: user.id,
    },
  });

  revalidatePath("/provider/projects");
  revalidatePath("/provider/my-projects");
}

export async function createSubmission(
  _state: CreateSubmissionState,
  formData: FormData,
): Promise<CreateSubmissionState> {
  const user = await getCurrentUser();

  if (!user || user.role !== "CANDIDATE") {
    return { message: "Only candidates can create submissions." };
  }

  const validatedFields = CreateSubmissionSchema.safeParse({
    projectId: formData.get("projectId"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { projectId, content } = validatedFields.data;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, industry: true },
  });

  if (!project) {
    return { message: "That project is no longer available." };
  }

  const existing = await prisma.submission.findUnique({
    where: {
      candidateId_projectId: {
        candidateId: user.id,
        projectId: project.id,
      },
    },
  });

  if (existing) {
    return { message: "You have already submitted for this project." };
  }

  await prisma.submission.create({
    data: {
      content,
      rating: randomSubmissionRating(),
      candidateId: user.id,
      projectId: project.id,
    },
  });

  revalidatePath("/candidate/projects/dashboards");
  revalidatePath(`/candidate/projects/${project.id}`);
  revalidatePath("/provider/projects");
  revalidatePath(`/provider/projects/${project.id}`);
}

export async function shortlistSubmission(formData: FormData) {
  const user = await getCurrentUser();

  if (!user || user.role !== "PROVIDER") {
    return;
  }

  const projectId = String(formData.get("projectId") ?? "").trim();
  const submissionId = String(formData.get("submissionId") ?? "").trim();

  if (!projectId || !submissionId) {
    return;
  }

  const submission = await prisma.submission.findFirst({
    where: {
      id: submissionId,
      projectId,
    },
    select: { id: true },
  });

  if (!submission) {
    return;
  }

  await prisma.submission.update({
    where: { id: submission.id },
    data: { shortlisted: true },
  });

  revalidatePath(`/provider/projects/${projectId}`);
  revalidatePath(`/provider/projects/${projectId}/submissions/${submission.id}`);
  revalidatePath("/dashboard/opportunities");
}

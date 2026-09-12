"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import {
  LoginFormSchema,
  SignupFormSchema,
  type LoginFormState,
  type SignupFormState,
} from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

export async function signup(
  _state: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    charityRegistrationNumber: formData.get("charityRegistrationNumber") ?? "",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, role, charityRegistrationNumber } =
    validatedFields.data;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return {
      errors: { email: ["An account with this email already exists."] },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      charityRegistrationNumber:
        role === "PROVIDER" && charityRegistrationNumber
          ? charityRegistrationNumber
          : null,
    },
  });

  await createSession(user.id, user.role);
  redirect("/dashboard");
}

export async function login(
  _state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { message: "Invalid email or password." };
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    return { message: "Invalid email or password." };
  }

  await createSession(user.id, user.role);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

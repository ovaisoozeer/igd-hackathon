import "server-only";

import { cookies } from "next/headers";
import type { Role, SessionPayload } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { decrypt, encrypt } from "@/lib/session-token";

const SESSION_COOKIE = "session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export async function createSession(userId: string, role: Role) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
  const session = await encrypt({ userId, role, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE)?.value;
  return decrypt(cookie);
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      charityRegistrationNumber: true,
    },
  });
}

export function isCharityProvider(
  user: {
    role: Role;
    charityRegistrationNumber?: string | null;
  } | null,
) {
  return Boolean(
    user?.role === "PROVIDER" && user.charityRegistrationNumber?.trim(),
  );
}

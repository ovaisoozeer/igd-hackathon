import { jwtVerify, SignJWT } from "jose";
import type { SessionPayload } from "@/lib/definitions";

function getEncodedKey() {
  const secretKey = process.env.SESSION_SECRET;

  if (!secretKey) {
    throw new Error("SESSION_SECRET is not set.");
  }

  return new TextEncoder().encode(secretKey);
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getEncodedKey());
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ["HS256"],
    });

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

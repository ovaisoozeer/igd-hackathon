import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { dashboardPath } from "@/lib/routes";
import { decrypt } from "@/lib/session-token";

const protectedRoutes = ["/dashboard", "/candidate", "/provider"];
const authRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await decrypt(request.cookies.get("session")?.value);
  const isAuthenticated = Boolean(session?.userId);
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    const home =
      session?.role === "PROVIDER" || session?.role === "CANDIDATE"
        ? dashboardPath(session.role)
        : "/candidate/dashboard";
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/candidate/:path*",
    "/provider/:path*",
    "/login",
    "/signup",
  ],
};

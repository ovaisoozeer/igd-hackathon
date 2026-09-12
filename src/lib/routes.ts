import type { Role } from "@/lib/definitions";

export function dashboardPath(role: Role) {
  return role === "PROVIDER" ? "/provider/dashboard" : "/candidate/dashboard";
}

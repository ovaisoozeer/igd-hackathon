import Link from "next/link";
import type { Role } from "@/lib/definitions";
import { LogoutButton } from "@/app/ui/logout-button";

type SiteHeaderProps = {
  user?: {
    name: string;
    role: Role;
  } | null;
};

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M4 15c3.5-4 6-6 8-6s4.5 2 8 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M4 19c3.5-3 6-4.5 8-4.5s4.5 1.5 8 4.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="font-serif text-xl tracking-tight">AttrAct</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="hidden text-[var(--muted)] sm:inline">
                {user.name}
              </span>
              <Link
                href="/dashboard"
                className="rounded-full px-3 py-1.5 text-[var(--ink)] transition hover:bg-[var(--sand)]"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-1.5 text-[var(--ink)] transition hover:bg-[var(--sand)]"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[var(--ink)] px-4 py-2 text-[var(--paper)] transition hover:bg-[var(--ink-soft)]"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

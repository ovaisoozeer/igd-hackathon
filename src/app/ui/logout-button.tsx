import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--ink)] transition hover:bg-[var(--sand)]"
      >
        Log out
      </button>
    </form>
  );
}

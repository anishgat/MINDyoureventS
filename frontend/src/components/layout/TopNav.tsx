import Link from "next/link";
import type { User } from "@/lib/types/user";

type TopNavProps = {
  user: User | null;
};

export default function TopNav({ user }: TopNavProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="chip">Hack4Good 2026</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--color-ink)] md:text-4xl">
          Event Command Center
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          Curate your week with community-led experiences and volunteer missions.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 text-sm text-[var(--color-ink-soft)] md:flex">
          Signed in as <span className="ml-1 font-semibold">{user?.name ?? "Guest"}</span>
        </div>
        <Link className="btn btn-ghost" href="/login">
          Switch role
        </Link>
      </div>
    </header>
  );
}

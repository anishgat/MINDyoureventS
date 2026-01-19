import Link from "next/link";
import type { User } from "@/lib/types/user";

type TopNavProps = {
  user: User | null;
};

export default function TopNav({ user }: TopNavProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center">
        <img
          src="/mindsLogo.png"
          alt="Minds logo"
          className="h-32 w-auto md:h-40"
        />
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

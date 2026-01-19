"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCurrentUserRole } from "@/lib/api/client";
import type { UserRole } from "@/lib/types/user";

const roles: { id: UserRole; label: string; detail: string }[] = [
  {
    id: "participant",
    label: "Participant",
    detail: "Join events, track your week, and RSVP in seconds.",
  },
  {
    id: "volunteer",
    label: "Volunteer",
    detail: "Support organizers on-site and take on extra shifts.",
  },
  {
    id: "admin",
    label: "Admin",
    detail: "Create events, manage capacity, and oversee signups.",
  },
];

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("participant");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    setIsSaving(true);
    await setCurrentUserRole(role);
    const target =
      role === "admin"
        ? "/admin/events"
        : role === "volunteer"
          ? "/volunteer/events"
          : "/participant/events";
    router.push(target);
  };

  return (
    <div className="min-h-screen px-4 py-12 md:px-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex justify-center">
          <img
            src="/mindsLogo.png"
            alt="Minds logo"
            className="h-32 w-auto"
          />
        </div>
        <form
          className="card flex flex-col gap-6 p-8 md:p-10"
          onSubmit={(event) => {
            event.preventDefault();
            if (!isSaving) {
              void handleContinue();
            }
          }}
        >
          <label className="text-sm font-semibold text-[var(--color-ink-soft)]">
            Username
            <input
              className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-white/90 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-[var(--color-brand)]"
              name="username"
              placeholder="alex.rivera"
              type="text"
              autoComplete="username"
            />
          </label>
          <label className="text-sm font-semibold text-[var(--color-ink-soft)]">
            Password
            <input
              className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-white/90 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-[var(--color-brand)]"
              name="password"
              placeholder="********"
              type="password"
              autoComplete="current-password"
            />
          </label>
          <label className="text-sm font-semibold text-[var(--color-ink-soft)]">
            Log in type
            <select
              className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-white/90 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-[var(--color-brand)]"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
            >
              {roles.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary" type="submit">
            {isSaving ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

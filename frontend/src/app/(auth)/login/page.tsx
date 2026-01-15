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
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <div className="fade-up" style={{ animationDelay: "0.05s" }}>
          <span className="chip">Mock sign-in</span>
          <h1 className="mt-4 text-4xl font-semibold">Choose your role</h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-ink-soft)]">
            This is a temporary sign-in flow while Firebase Auth is being wired
            up. Pick a role to preview the experience and access admin-only
            screens.
          </p>
        </div>

        <div
          className="fade-up grid gap-6 md:grid-cols-3"
          style={{ animationDelay: "0.1s" }}
        >
          {roles.map((option) => (
            <button
              key={option.id}
              className={
                role === option.id
                  ? "card border-[var(--color-brand)] p-6 text-left"
                  : "card p-6 text-left"
              }
              onClick={() => setRole(option.id)}
              type="button"
            >
              <h2 className="text-xl font-semibold">{option.label}</h2>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                {option.detail}
              </p>
              {role === option.id && (
                <p className="mt-4 text-xs font-semibold text-[var(--color-brand)]">
                  Selected
                </p>
              )}
            </button>
          ))}
        </div>

        <div className="fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex flex-wrap items-center gap-4">
            <button
              className="btn btn-primary"
              onClick={handleContinue}
              type="button"
            >
              {isSaving ? "Saving..." : "Continue to dashboard"}
            </button>
            <p className="text-xs text-[var(--color-ink-soft)]">
              Role selections are stored in local storage for the mock session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { createEvent, getCurrentUser } from "@/lib/api/client";
import type { EventInput } from "@/lib/types/event";
import type { User } from "@/lib/types/user";

type EventFormState = Omit<EventInput, "capacity"> & { capacity: string };

const emptyForm: EventFormState = {
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  imageUrl: "",
  capacity: "",
};

export default function CreateEventPage() {
  const [user, setUser] = useState<User | null>(null);
  const [formState, setFormState] = useState<EventFormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    load();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen px-4 py-12 md:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="card p-10 text-center text-sm text-[var(--color-ink-soft)]">
            Loading admin access...
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen px-4 py-12 md:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="card p-10">
            <h1 className="text-3xl font-semibold">Admin access required</h1>
            <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
              Only administrators can create new events. Switch to an admin role
              to continue.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="btn btn-primary" href="/login">
                Switch role
              </Link>
              <Link className="btn btn-ghost" href="/events">
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (field: keyof EventFormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (
      !formState.title ||
      !formState.description ||
      !formState.date ||
      !formState.startTime ||
      !formState.endTime ||
      !formState.location
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const payload: EventInput = {
      ...formState,
      capacity: formState.capacity ? Number(formState.capacity) : 0,
    };

    await createEvent(payload);
    setSuccess(true);
    setFormState(emptyForm);
  };

  return (
    <div className="min-h-screen px-4 py-12 md:px-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="fade-up" style={{ animationDelay: "0.05s" }}>
          <span className="chip">Admin only</span>
          <h1 className="mt-4 text-4xl font-semibold">Create a new event</h1>
          <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
            Publish a new opportunity to the Hack4Good event calendar. This is
            currently a mock submission that updates local in-memory data.
          </p>
        </div>

        <form
          className="card fade-up space-y-6 p-8"
          onSubmit={handleSubmit}
          style={{ animationDelay: "0.1s" }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-semibold">Title *</span>
              <input
                className="w-full rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3"
                onChange={(event) => handleChange("title", event.target.value)}
                value={formState.title}
                type="text"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-semibold">Location *</span>
              <input
                className="w-full rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3"
                onChange={(event) =>
                  handleChange("location", event.target.value)
                }
                value={formState.location}
                type="text"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm">
            <span className="font-semibold">Description *</span>
            <textarea
              className="min-h-[120px] w-full rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3"
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              value={formState.description}
            />
          </label>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-semibold">Date *</span>
              <input
                className="w-full rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3"
                onChange={(event) => handleChange("date", event.target.value)}
                value={formState.date}
                type="date"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-semibold">Capacity</span>
              <input
                className="w-full rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3"
                onChange={(event) =>
                  handleChange("capacity", event.target.value)
                }
                value={formState.capacity}
                type="number"
                min={0}
              />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-semibold">Start time *</span>
              <input
                className="w-full rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3"
                onChange={(event) =>
                  handleChange("startTime", event.target.value)
                }
                value={formState.startTime}
                type="time"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-semibold">End time *</span>
              <input
                className="w-full rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3"
                onChange={(event) =>
                  handleChange("endTime", event.target.value)
                }
                value={formState.endTime}
                type="time"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm">
            <span className="font-semibold">Image URL</span>
            <input
              className="w-full rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3"
              onChange={(event) =>
                handleChange("imageUrl", event.target.value)
              }
              value={formState.imageUrl}
              type="url"
            />
          </label>

          {error && (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          )}
          {success && (
            <p className="text-sm font-semibold text-emerald-700">
              Event created in mock data. Check the dashboard list.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button className="btn btn-primary" type="submit">
              Publish event
            </button>
            <Link className="btn btn-ghost" href="/events">
              Back to dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

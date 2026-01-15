"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import EventCalendar from "@/components/event/EventCalendar";
import EventList from "@/components/event/EventList";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import {
  getCurrentUser,
  listEvents,
  listUserSignups,
  toggleSignup,
} from "@/lib/api/client";
import type { EventItem, Signup } from "@/lib/types/event";
import type { User } from "@/lib/types/user";

type ViewMode = "calendar" | "list";

export default function EventsDashboard() {
  const [view, setView] = useState<ViewMode>("calendar");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();
      const [eventData, signupData] = await Promise.all([
        listEvents(),
        listUserSignups(currentUser.id),
      ]);
      setUser(currentUser);
      setEvents(eventData);
      setSignups(signupData);
      setIsLoading(false);
    };

    load();
  }, []);

  const signedEventIds = useMemo(
    () => new Set(signups.map((signup) => signup.eventId)),
    [signups]
  );

  const signedEvents = useMemo(
    () => events.filter((event) => signedEventIds.has(event.id)),
    [events, signedEventIds]
  );

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = `${a.date}T${a.startTime}`;
      const dateB = `${b.date}T${b.startTime}`;
      return dateA.localeCompare(dateB);
    });
  }, [events]);

  const handleToggleSignup = async (eventId: string) => {
    if (!user) {
      return;
    }
    const updated = await toggleSignup(eventId, user.id, user.role);
    setSignups(updated);
  };

  return (
    <div className="min-h-screen px-2 py-6 sm:px-4 md:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="fade-up" style={{ animationDelay: "0.05s" }}>
          <TopNav user={user} />
        </div>

        <div
          className="fade-up flex flex-wrap items-center justify-between gap-4"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              className={view === "calendar" ? "btn btn-primary" : "btn btn-ghost"}
              onClick={() => setView("calendar")}
              type="button"
            >
              Calendar view
            </button>
            <button
              className={view === "list" ? "btn btn-primary" : "btn btn-ghost"}
              onClick={() => setView("list")}
              type="button"
            >
              List view
            </button>
            {user?.role === "admin" ? (
              <Link className="btn btn-ghost" href="/create-event">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                </svg>
                Create
              </Link>
            ) : null}
          </div>
          <div className="chip">{sortedEvents.length} total events</div>
        </div>

        {isLoading ? (
          <div className="card p-10 text-center text-sm text-[var(--color-ink-soft)]">
            Loading event dashboard...
          </div>
        ) : (
          <div
            className="fade-up grid gap-8 lg:grid-cols-[1.6fr_0.9fr]"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="space-y-6">
              {view === "calendar" ? (
                <EventCalendar
                  events={sortedEvents}
                  signedEventIds={signedEventIds}
                  onToggleSignup={handleToggleSignup}
                />
              ) : (
                <EventList
                  events={sortedEvents}
                  signedEventIds={signedEventIds}
                  onToggleSignup={handleToggleSignup}
                />
              )}
            </div>
            <Sidebar signedEvents={signedEvents} />
          </div>
        )}
      </div>
    </div>
  );
}


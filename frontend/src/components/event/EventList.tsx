'use client';

import type { EventItem } from "@/lib/types/event";
import EventCarouselCard from "./EventCarouselCard";

type EventListProps = {
  events: EventItem[];
  signedEventIds: Set<string>;
  userRole?: string;
  onToggleSignup: (eventId: string) => void;
};

export default function EventList({
  events,
  signedEventIds,
  userRole,
  onToggleSignup,
}: EventListProps) {
  const today = new Date();

  const labelForDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow =
      date.getFullYear() === tomorrow.getFullYear() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getDate() === tomorrow.getDate();

    if (isToday) return "Today";
    if (isTomorrow) {
      return `Tomorrow, ${date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
      })}`;
    }

    return date.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const eventsByDate = events.reduce<Record<string, EventItem[]>>(
    (acc, event) => {
      acc[event.date] = acc[event.date] ? [...acc[event.date], event] : [event];
      return acc;
    },
    {}
  );

  const orderedDates = Object.keys(eventsByDate).sort((a, b) => a.localeCompare(b));

  const isVolunteerOrAdmin = userRole === 'volunteer' || userRole === 'admin';

  return (
    <section className="w-full">
      {orderedDates.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-4 py-16 text-center">
          {!isVolunteerOrAdmin && (
            <div className="h-32 w-full max-w-xl rounded-3xl bg-gradient-to-r from-[var(--color-sky)] via-white to-[var(--color-mist)]" />
          )}
          <p className="text-sm font-semibold text-[var(--color-ink-soft)]">
            Nothing planned yet.
          </p>
          {!isVolunteerOrAdmin && (
            <p className="max-w-sm text-xs text-[var(--color-ink-soft)]">
              As you add events to the week, they will appear here in a beautiful carousel.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {orderedDates.map((dateKey) => {
            const dayEvents = eventsByDate[dateKey];
            const headerLabel = labelForDate(dateKey);
            const rangeLabel = dayEvents[0]
              ? new Date(dateKey).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                })
              : "";

            return (
              <div key={dateKey} className="space-y-5">
                {/* Date Header */}
                <div className="flex items-baseline justify-between gap-2 px-1">
                  <h2 className="text-2xl font-bold text-[var(--color-ink)]">
                    {headerLabel}
                  </h2>
                  <span className="text-sm font-medium text-[var(--color-ink-soft)]">
                    {rangeLabel}
                  </span>
                </div>

                {/* Horizontal Carousel */}
                <div className="relative w-full">
                  <div className="overflow-x-auto overflow-y-visible scrollbar-hide pb-6 scroll-smooth">
                    <div className="flex gap-6 px-1" style={{ scrollSnapType: 'x mandatory' }}>
                      {dayEvents.map((event, index) => (
                        <div
                          key={event.id}
                          className="flex-shrink-0"
                          style={{ scrollSnapAlign: index === 0 ? 'start' : 'center' }}
                        >
                          <EventCarouselCard
                            event={event}
                            isSignedUp={signedEventIds.has(event.id)}
                            userRole={userRole}
                            onToggleSignup={onToggleSignup}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

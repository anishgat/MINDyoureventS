import type { EventItem } from "@/lib/types/event";
import EventCard from "./EventCard";

type EventListProps = {
  events: EventItem[];
  signedEventIds: Set<string>;
  onToggleSignup: (eventId: string) => void;
};

export default function EventList({
  events,
  signedEventIds,
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

  return (
    <section className="card grid-texture max-h-[640px] overflow-y-auto p-4 sm:p-6">
      {orderedDates.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="h-32 w-full max-w-xl rounded-3xl bg-gradient-to-r from-[var(--color-sky)] via-white to-[var(--color-mist)]" />
          <p className="text-sm font-semibold text-[var(--color-ink-soft)]">
            Nothing planned yet.
          </p>
          <p className="max-w-sm text-xs text-[var(--color-ink-soft)]">
            As you add events to the week, they will appear here grouped by day so you
            can quickly scan what is coming up.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
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
              <div key={dateKey} className="space-y-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-base font-semibold text-[var(--color-ink)]">
                    {headerLabel}
                  </h2>
                  <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
                    {rangeLabel}
                  </span>
                </div>
                <div className="space-y-3">
                  {dayEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isSignedUp={signedEventIds.has(event.id)}
                      onToggleSignup={onToggleSignup}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

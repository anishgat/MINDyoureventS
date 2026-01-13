import type { EventItem } from "@/lib/types/event";

type EventCalendarProps = {
  events: EventItem[];
};

const buildCalendarCells = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDay + totalDays) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const day = index - firstDay + 1;
    if (day < 1 || day > totalDays) {
      return null;
    }
    return day;
  });
};

export default function EventCalendar({ events }: EventCalendarProps) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthLabel = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const eventsByDate = events.reduce<Record<string, EventItem[]>>(
    (acc, event) => {
      acc[event.date] = acc[event.date] ? [...acc[event.date], event] : [event];
      return acc;
    },
    {}
  );

  const cells = buildCalendarCells(year, month);

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{monthLabel}</h2>
        <span className="chip">Calendar view</span>
      </div>
      <div className="mt-6 grid grid-cols-7 gap-3 text-xs text-[var(--color-ink-soft)]">
        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((label) => (
          <div key={label} className="text-center font-semibold uppercase">
            {label}
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-3">
        {cells.map((day, index) => {
          const dateKey = day
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : null;
          const dayEvents = dateKey ? eventsByDate[dateKey] ?? [] : [];

          return (
            <div
              key={`cell-${index}`}
              className="min-h-[120px] rounded-2xl border border-[var(--color-border)] bg-white/60 p-3"
            >
              {day ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--color-ink)]">
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-semibold text-[var(--color-brand)]">
                        {dayEvents.length} events
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-2">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="rounded-lg bg-[var(--color-mist)] px-2 py-1 text-[10px] font-semibold text-[var(--color-ink-soft)]"
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-[var(--color-ink-soft)]">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="h-full rounded-xl bg-white/40" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

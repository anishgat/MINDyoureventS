'use client';

import { useState } from 'react';
import type { EventItem } from "@/lib/types/event";
import EventDetailsModal from './EventDetailsModal';

type EventCalendarProps = {
  events: EventItem[];
  signedEventIds: Set<string>;
  onToggleSignup: (eventId: string) => void;
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

export default function EventCalendar({
  events,
  signedEventIds,
  onToggleSignup,
}: EventCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

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
    <section className="calendar-board">
      <div className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-semibold text-[var(--color-ink)]">
            {monthLabel}
          </h2>
          <span className="rounded-full bg-[rgba(255,255,255,0.85)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#005bbb]">
            Fun Week Planner
          </span>
        </div>
        <span className="hidden rounded-full bg-[rgba(255,255,255,0.9)] px-3 py-1 text-xs font-semibold text-[var(--color-ink-soft)] sm:inline-flex">
          Tap a box to explore the day
        </span>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-px px-2 text-xs font-bold uppercase tracking-wide text-white sm:px-4">
        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((label) => (
          <div
            key={label}
            className="flex h-10 items-center justify-center rounded-t-[10px] bg-[#3b82f6] text-center shadow-sm sm:h-11"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="calendar-grid mt-0 grid grid-cols-7 gap-px px-2 pb-4 sm:px-4 sm:pb-6">
        {cells.map((day, index) => {
          const dateKey = day
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : null;
          const dayEvents = dateKey ? eventsByDate[dateKey] ?? [] : [];

          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={`cell-${index}`}
              className={
                hasEvents
                  ? "calendar-cell calendar-cell-has-events"
                  : "calendar-cell"
              }
              role={hasEvents ? "button" : undefined}
              tabIndex={hasEvents ? 0 : -1}
              onClick={
                hasEvents
                  ? () => {
                      // If there are events, open the first one when the whole cell is clicked
                      setSelectedEvent(dayEvents[0]);
                    }
                  : undefined
              }
              onKeyDown={
                hasEvents
                  ? (eventKey) => {
                      if (eventKey.key === "Enter" || eventKey.key === " ") {
                        eventKey.preventDefault();
                        setSelectedEvent(dayEvents[0]);
                      }
                    }
                  : undefined
              }
            >
              {day ? (
                <>
                  <div className="flex items-start justify-between gap-1">
                    <span className="calendar-day-label">{day}</span>
                    {hasEvents && (
                      <span className="calendar-day-bubble">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {dayEvents.slice(0, 2).map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        className="calendar-event-pill"
                        onClick={(eventClick) => {
                          eventClick.stopPropagation();
                          setSelectedEvent(event);
                        }}
                      >
                        <span className="calendar-event-icon" aria-hidden="true">
                          ★
                        </span>
                        <span className="line-clamp-2">{event.title}</span>
                      </button>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] font-semibold text-[#1d4ed8]">
                        +{dayEvents.length - 2} more fun events
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="h-full w-full rounded-[14px] bg-[rgba(255,255,255,0.55)]" />
              )}
            </div>
          );
        })}
      </div>
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isSignedUp={signedEventIds.has(selectedEvent.id)}
          onClose={() => setSelectedEvent(null)}
          onRegister={async () => {
            onToggleSignup(selectedEvent.id);
          }}
        />
      )}
    </section>
  );
}

'use client';

import { useState, useMemo } from 'react';
import type { EventItem } from "@/lib/types/event";
import EventDetailsModal from './EventDetailsModal';
import { getEventColorClasses } from '@/lib/utils/eventColors';

type EventCalendarProps = {
  events: EventItem[];
  signedEventIds: Set<string>;
  userRole?: string;
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
  userRole,
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
  const isVolunteerOrAdmin = userRole === 'volunteer' || userRole === 'admin';

  return (
    <section className={isVolunteerOrAdmin ? "calendar-board-professional" : "calendar-board"}>
      <div className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-semibold text-[var(--color-ink)]">
            {monthLabel}
          </h2>
          {!isVolunteerOrAdmin && (
            <span className="rounded-full bg-[rgba(255,255,255,0.85)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#005bbb]">
              Fun Week Planner
            </span>
          )}
        </div>
        {!isVolunteerOrAdmin && (
          <span className="hidden rounded-full bg-[rgba(255,255,255,0.9)] px-3 py-1 text-xs font-semibold text-[var(--color-ink-soft)] sm:inline-flex">
            Tap a box to explore the day
          </span>
        )}
      </div>

      {/* Color Legend for Volunteers/Admins */}
      {isVolunteerOrAdmin && (
        <div className="mx-4 mb-4 rounded-xl border border-[var(--color-border)] bg-white/90 px-4 py-3 sm:mx-6">
          <h3 className="mb-3 text-sm font-bold text-[var(--color-ink)]">Legend</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-yellow-400 bg-yellow-400/80" />
              <span className="text-xs font-semibold text-[var(--color-ink)]">
                Experienced volunteers only
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-green-500 bg-green-500/80" />
              <span className="text-xs font-semibold text-[var(--color-ink)]">
                Quota reached / Don't need volunteers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-blue-500 bg-blue-500/80" />
              <span className="text-xs font-semibold text-[var(--color-ink)]">
                Volunteer events / External matters
              </span>
            </div>
          </div>
        </div>
      )}
      <div className={`mt-4 grid grid-cols-7 gap-px px-2 text-xs font-bold uppercase tracking-wide sm:px-4 ${
        isVolunteerOrAdmin 
          ? 'text-[var(--color-ink)]' 
          : 'text-white'
      }`}>
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
            className={`flex h-10 items-center justify-center rounded-t-[10px] text-center shadow-sm sm:h-11 ${
              isVolunteerOrAdmin
                ? 'bg-gray-100 text-[var(--color-ink)] font-semibold'
                : 'bg-[#3b82f6] text-white'
            }`}
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
                    {dayEvents.slice(0, 2).map((event) => {
                      // Get color classes for volunteers/admins
                      let colorClasses = '';
                      if (isVolunteerOrAdmin) {
                        if (event.volunteerEventType === 'experienced') {
                          colorClasses = 'bg-yellow-400/90 border-yellow-500 text-yellow-900';
                        } else if (event.volunteerEventType === 'quota_reached') {
                          colorClasses = 'bg-green-500/90 border-green-600 text-green-900';
                        } else if (event.volunteerEventType === 'volunteer_only') {
                          colorClasses = 'bg-blue-500/90 border-blue-600 text-blue-900';
                        } else {
                          // Default gray for events without special type
                          colorClasses = 'bg-gray-500/80 border-gray-600 text-gray-900';
                        }
                      }

                      return (
                        <button
                          key={event.id}
                          type="button"
                          className={`calendar-event-pill ${colorClasses}`}
                          onClick={(eventClick) => {
                            eventClick.stopPropagation();
                            setSelectedEvent(event);
                          }}
                        >
                          {!isVolunteerOrAdmin && (
                            <span className="calendar-event-icon" aria-hidden="true">
                              ★
                            </span>
                          )}
                          <span className="line-clamp-2">{event.title}</span>
                        </button>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className={`text-[10px] font-semibold ${isVolunteerOrAdmin ? 'text-[var(--color-ink-soft)]' : 'text-[#1d4ed8]'}`}>
                        +{dayEvents.length - 2} more {isVolunteerOrAdmin ? 'events' : 'fun events'}
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
          userRole={userRole as "admin" | "participant" | "volunteer" | undefined}
          onClose={() => setSelectedEvent(null)}
          onRegister={async () => {
            onToggleSignup(selectedEvent.id);
          }}
        />
      )}
    </section>
  );
}

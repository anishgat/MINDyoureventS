'use client';

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { EventItem } from "@/lib/types/event";
import EventDetailsModal from "./EventDetailsModal";
import { getKidIconForEventTitle } from "@/lib/utils/kidIcons";

type EventCalendarProps = {
  events: EventItem[];
  signedEventIds: Set<string>;
  userRole?: string;
  onToggleSignup: (eventId: string) => void;
};

type CalendarTone = {
  border: string;
  headerBg: string;
  headerText: string;
  cellBg: string;
  cellEventBg: string;
  cellHover: string;
  dayBubble: string;
  titleText: string;
  timeBadge: string;
};

const CAROUSEL_INTERVAL_MS = 3500;

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

  const eventsByDate = useMemo(
    () =>
      events.reduce<Record<string, EventItem[]>>((acc, event) => {
        acc[event.date] = acc[event.date] ? [...acc[event.date], event] : [event];
        return acc;
      }, {}),
    [events]
  );

  const cells = buildCalendarCells(year, month);
  const isVolunteerOrAdmin = userRole === 'volunteer' || userRole === 'admin';
  const tone: CalendarTone = isVolunteerOrAdmin
    ? {
        border: "border-slate-300",
        headerBg: "bg-slate-100",
        headerText: "text-slate-700",
        cellBg: "bg-white",
        cellEventBg: "bg-slate-50",
        cellHover: "hover:bg-slate-100",
        dayBubble: "bg-slate-600 text-white",
        titleText: "text-slate-900",
        timeBadge: "bg-slate-700 text-white",
      }
    : {
        border: "border-[var(--color-brand-dark)]",
        headerBg: "bg-[#93c5fd]",
        headerText: "text-[#1e3a8a]",
        cellBg: "bg-white",
        cellEventBg: "bg-[#bfdbfe]",
        cellHover: "hover:bg-[#dbeafe]",
        dayBubble: "bg-[var(--color-brand-dark)] text-white",
        titleText: "text-[#1e3a8a]",
        timeBadge: "bg-[var(--color-brand)] text-white",
      };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between gap-4 px-2 pt-4 sm:px-4 sm:pt-6">
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
      <div
        className={`mt-4 overflow-hidden rounded-2xl bg-white/90 shadow-[0_18px_40px_rgba(30,64,175,0.18)] ${
          isVolunteerOrAdmin ? "shadow-[0_10px_24px_rgba(15,23,42,0.12)]" : ""
        }`}
      >
        <div className={`grid grid-cols-7 border-2 ${tone.border}`}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
            <div
              key={label}
              className={`flex items-center justify-center border-r-2 ${tone.border} ${tone.headerBg} ${tone.headerText} py-2 text-center text-xs font-bold uppercase tracking-wide sm:text-sm md:text-base last:border-r-0`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className={`grid grid-cols-7 border-l-2 border-r-2 border-b-2 ${tone.border}`}>
        {cells.map((day, index) => {
          const dateKey = day
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : null;
          const dayEvents = dateKey ? eventsByDate[dateKey] ?? [] : [];
          const isLastColumn = (index + 1) % 7 === 0;
          const isLastRow = index >= cells.length - 7;

          return (
            <CalendarCell
              key={`cell-${index}`}
              day={day}
              dayEvents={dayEvents}
              isVolunteerOrAdmin={isVolunteerOrAdmin}
              isLastColumn={isLastColumn}
              isLastRow={isLastRow}
              tone={tone}
              onSelectEvent={(event) => setSelectedEvent(event)}
            />
          );
        })}
        </div>
      </div>
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isSignedUp={signedEventIds.has(selectedEvent.id)}
          userRole={userRole as "admin" | "participant" | "volunteer" | undefined}
          onClose={() => setSelectedEvent(null)}
          onRegister={async () => {
            await onToggleSignup(selectedEvent.id);
          }}
        />
      )}
    </section>
  );
}

type CalendarCellProps = {
  day: number | null;
  dayEvents: EventItem[];
  isVolunteerOrAdmin: boolean;
  isLastColumn: boolean;
  isLastRow: boolean;
  tone: CalendarTone;
  onSelectEvent: (event: EventItem) => void;
};

function CalendarCell({
  day,
  dayEvents,
  isVolunteerOrAdmin,
  isLastColumn,
  isLastRow,
  tone,
  onSelectEvent,
}: CalendarCellProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const hasEvents = dayEvents.length > 0;

  useEffect(() => {
    if (dayEvents.length <= 1) {
      setCarouselIndex(0);
      return;
    }
    const interval = window.setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % dayEvents.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [dayEvents.length]);

  const activeIndex = hasEvents ? carouselIndex % dayEvents.length : 0;
  const activeEvent = hasEvents ? dayEvents[activeIndex] : null;
  const eventToOpen = hasEvents ? activeEvent ?? dayEvents[0] : null;

  const volunteerCellBg = (() => {
    if (!isVolunteerOrAdmin || !activeEvent) {
      return tone.cellEventBg;
    }
    if (activeEvent.volunteerEventType === "experienced") {
      return "bg-yellow-100/80";
    }
    if (activeEvent.volunteerEventType === "quota_reached") {
      return "bg-green-100/80";
    }
    if (activeEvent.volunteerEventType === "volunteer_only") {
      return "bg-blue-100/80";
    }
    return tone.cellEventBg;
  })();

  const cellClasses = [
    "min-h-[110px] md:min-h-[140px] p-2 relative overflow-hidden transition-colors",
    isLastColumn ? "border-r-0" : "border-r-2",
    isLastRow ? "border-b-0" : "border-b-2",
    tone.border,
    hasEvents ? (isVolunteerOrAdmin ? volunteerCellBg : tone.cellEventBg) : tone.cellBg,
    hasEvents ? tone.cellHover : "",
    hasEvents ? "cursor-pointer" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (!day) {
    return <div className={cellClasses} />;
  }

  return (
    <div
      className={cellClasses}
      role={hasEvents ? "button" : undefined}
      tabIndex={hasEvents ? 0 : -1}
      onClick={
        hasEvents
          ? () => {
              if (eventToOpen) {
                onSelectEvent(eventToOpen);
              }
            }
          : undefined
      }
      onKeyDown={
        hasEvents
          ? (eventKey) => {
              if (eventKey.key === "Enter" || eventKey.key === " ") {
                eventKey.preventDefault();
                if (eventToOpen) {
                  onSelectEvent(eventToOpen);
                }
              }
            }
          : undefined
      }
    >
      <div className="flex items-start gap-2">
        <span className={`text-sm font-bold md:text-base ${tone.titleText}`}>{day}</span>
      </div>
      {hasEvents && (
        <div className="absolute right-2 top-2 flex items-center gap-2">
          {dayEvents.length > 1 && (
            <div className="flex items-center gap-1" aria-label="Event carousel position">
              {dayEvents.map((event, idx) => (
                <span
                  key={`${event.id}-dot`}
                  className={`h-1.5 w-1.5 rounded-full ${
                    idx === activeIndex
                      ? isVolunteerOrAdmin
                        ? "bg-slate-700"
                        : "bg-[var(--color-brand-dark)]"
                      : "bg-slate-300"
                  }`}
                />
              ))}
            </div>
          )}
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${tone.dayBubble}`}
            aria-label={`${dayEvents.length} events`}
          >
            {dayEvents.length}
          </span>
        </div>
      )}

      {hasEvents ? (
        <div className="mt-2 space-y-2">
          {activeEvent && (
            <CalendarEventPreview
              key={activeEvent.id}
              event={activeEvent}
              isVolunteerOrAdmin={isVolunteerOrAdmin}
              tone={tone}
              onSelectEvent={onSelectEvent}
            />
          )}
        </div>
      ) : (
        <div className={`mt-3 text-[10px] font-semibold ${tone.titleText}`}>
          No events
        </div>
      )}
    </div>
  );
}

type CalendarEventPreviewProps = {
  event: EventItem;
  isVolunteerOrAdmin: boolean;
  tone: CalendarTone;
  onSelectEvent: (event: EventItem) => void;
};

function CalendarEventPreview({
  event,
  isVolunteerOrAdmin,
  tone,
  onSelectEvent,
}: CalendarEventPreviewProps) {
  const eventTime = event.endTime ? `${event.startTime} - ${event.endTime}` : event.startTime;
  const icon = getKidIconForEventTitle(event.title);
  const hasCalendarIcon = Boolean(event.calendarIconUrl);
  const hasImage = Boolean(event.imageUrl);

  let volunteerTone = "border-transparent";
  if (isVolunteerOrAdmin) {
    if (event.volunteerEventType === "experienced") {
      volunteerTone = "border-transparent";
    } else if (event.volunteerEventType === "quota_reached") {
      volunteerTone = "border-transparent";
    } else if (event.volunteerEventType === "volunteer_only") {
      volunteerTone = "border-transparent";
    }
  }

  return (
    <button
      type="button"
      className="fade-up flex w-full items-start gap-1 rounded-sm border border-transparent p-0 text-left bg-transparent shadow-none"
      onClick={(eventClick) => {
        eventClick.stopPropagation();
        onSelectEvent(event);
      }}
    >
      <div className="min-w-0 flex-1 pr-1">
        <div className="flex items-start gap-1">
          {!isVolunteerOrAdmin && (
            <span
              className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-sm bg-white text-[11px]"
              aria-hidden="true"
              title={icon.label}
            >
              {icon.emoji}
            </span>
          )}
          <div className={`text-[10px] font-bold leading-tight sm:text-[11px] ${tone.titleText} line-clamp-2`}>
            {event.title}
          </div>
        </div>
        <div
          className={`mt-1.5 inline-flex rounded-sm px-1.5 py-0.5 text-[8px] font-semibold sm:text-[9px] ${tone.timeBadge}`}
        >
          {eventTime}
        </div>
      </div>
      <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 overflow-hidden rounded-sm border border-white/70 bg-white">
        {hasCalendarIcon ? (
          <Image
            src={event.calendarIconUrl!}
            alt={`${event.title} icon`}
            fill
            sizes="64px"
            className="object-contain"
            unoptimized
          />
        ) : hasImage ? (
          <Image
            src={event.imageUrl!}
            alt={event.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#dbeafe,#fef9c3)]">
            <span className="text-[10px] font-bold text-[#1e3a8a]">Event</span>
          </div>
        )}
      </div>
    </button>
  );
}

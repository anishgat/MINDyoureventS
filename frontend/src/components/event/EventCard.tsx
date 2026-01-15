'use client';

import { useState } from 'react';
import type { EventItem } from '@/lib/types/event';
import EventDetailsModal from './EventDetailsModal';

type EventCardProps = {
  event: EventItem;
  isSignedUp: boolean;
  onToggleSignup: (eventId: string) => void;
};

export default function EventCard({ event, isSignedUp, onToggleSignup }: EventCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleRegister = async () => {
    await onToggleSignup(event.id);
  };

  return (
    <>
      <article 
        className="card overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
        onClick={() => setShowModal(true)}
      >
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center">
          <div className="h-28 w-full rounded-2xl bg-[linear-gradient(135deg,#e6f6ff,#fff1d6)] md:h-24 md:w-40" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                  {event.date} {event.startTime}-{event.endTime}
                </p>
                <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                  {event.location}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={isSignedUp ? 'btn btn-ghost' : 'btn btn-primary'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                  type="button"
                >
                  {isSignedUp ? 'Registered' : 'Register'}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded((value) => !value);
                  }}
                  type="button"
                >
                  {expanded ? 'Less' : 'Details'}
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-ink-soft)]">
              <span className="chip">Capacity {event.capacity}</span>
              <span className="chip">{isSignedUp ? 'Enrolled' : 'Open spots'}</span>
            </div>
          </div>
        </div>
        {expanded && (
          <div className="border-t border-[var(--color-border)] bg-white/80 px-6 pb-6 pt-4">
            <p className="text-sm text-[var(--color-ink-soft)]">{event.description}</p>
            <div className="mt-4 grid gap-3 text-xs text-[var(--color-ink-soft)] sm:grid-cols-2">
              <div>
                <p className="font-semibold text-[var(--color-ink)]">Hosted by</p>
                <p>Hack4Good Staff</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--color-ink)]">Check-in</p>
                <p>Arrive 15 minutes early for supplies and briefing.</p>
              </div>
            </div>
          </div>
        )}
      </article>

      {showModal && (
        <EventDetailsModal
          event={event}
          isSignedUp={isSignedUp}
          onClose={() => setShowModal(false)}
          onRegister={handleRegister}
        />
      )}
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import type { EventItem } from '@/lib/types/event';
import type { UserRole } from '@/lib/types/user';
import RegistrationFlow from './RegistrationFlow';
import VolunteersList from './VolunteersList';
import { getVolunteersForEvent } from '@/lib/api/volunteers';
import { isQuotaReached } from '@/lib/utils/eventColors';

type EventDetailsModalProps = {
  event: EventItem;
  isSignedUp: boolean;
  userRole?: UserRole;
  onClose: () => void;
  onRegister: () => Promise<void>;
};

export default function EventDetailsModal({
  event,
  isSignedUp,
  userRole,
  onClose,
  onRegister,
}: EventDetailsModalProps) {
  const [showRegistration, setShowRegistration] = useState(false);
  const [isRegistered, setIsRegistered] = useState(isSignedUp);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [isQuotaFull, setIsQuotaFull] = useState(false);

  useEffect(() => {
    // Lock background scroll while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    // Check quota status for volunteers/admins
    let interval: NodeJS.Timeout | null = null;
    if ((userRole === 'volunteer' || userRole === 'admin') && event.volunteerQuota !== undefined) {
      getVolunteersForEvent(event.id).then((volunteers) => {
        setVolunteerCount(volunteers.length);
        setIsQuotaFull(isQuotaReached(event, volunteers.length));
      });
      
      // Refresh quota check periodically
      interval = setInterval(() => {
        getVolunteersForEvent(event.id).then((volunteers) => {
          setVolunteerCount(volunteers.length);
          setIsQuotaFull(isQuotaReached(event, volunteers.length));
        });
      }, 2000);
    }
    
    return () => {
      document.body.style.overflow = originalOverflow;
      if (interval) clearInterval(interval);
    };
  }, [event.id, event.volunteerQuota, event.volunteerEventType, userRole]);

  const handleRegisterComplete = async () => {
    await onRegister();
    setIsRegistered(true);
    setShowRegistration(false);
  };

  const handleClose = () => {
    setShowRegistration(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Main Modal */}
      <div className="fixed inset-4 z-50 mx-auto max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="relative flex-shrink-0 bg-gradient-to-br from-[#3b82f6] via-[#22c55e] to-[#f97316] p-6">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] shadow-md transition-transform hover:scale-110 cursor-pointer"
              type="button"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="pr-12 text-3xl font-bold text-white drop-shadow-lg">
              {event.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/95">
              <span className="flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1.5 backdrop-blur-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {event.date}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1.5 backdrop-blur-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {event.startTime} - {event.endTime}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1.5 backdrop-blur-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location}
              </span>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Media Section */}
            {event.imageUrl ? (
              <div className="mb-6 overflow-hidden rounded-2xl">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : (
              <div className="mb-6 flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#e0f2fe] via-[#fef3c7] to-[#fce7f3]">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-20 w-20 rounded-full bg-white/80 p-4">
                    <svg className="h-full w-full text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-ink-soft)]">Event Image</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-3 text-xl font-bold text-[var(--color-ink)]">About This Event</h3>
              <p className="text-base leading-relaxed text-[var(--color-ink-soft)] whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid gap-4 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-mist)] p-5 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-sm font-bold text-[var(--color-ink)]">Hosted by</p>
                <p className="text-sm text-[var(--color-ink-soft)]">Hack4Good Staff</p>
              </div>
              <div>
                <p className="mb-1 text-sm font-bold text-[var(--color-ink)]">Capacity</p>
                <p className="text-sm text-[var(--color-ink-soft)]">
                  {event.capacity > 0 ? `${event.capacity} spots available` : 'Unlimited'}
                </p>
              </div>
              {userRole === 'volunteer' && event.volunteerQuota !== undefined && (
                <div>
                  <p className="mb-1 text-sm font-bold text-[var(--color-ink)]">Volunteers Needed</p>
                  <p className="text-sm font-semibold text-[#3b82f6]">
                    {event.volunteerQuota} volunteers required
                  </p>
                </div>
              )}
              <div className="sm:col-span-2">
                <p className="mb-1 text-sm font-bold text-[var(--color-ink)]">Check-in</p>
                <p className="text-sm text-[var(--color-ink-soft)]">
                  Arrive 15 minutes early for supplies and briefing.
                </p>
              </div>
            </div>

            {/* Volunteers List - Single communal list at bottom of description */}
            {(userRole === 'volunteer' || userRole === 'admin') && event.volunteerQuota !== undefined && (
              <div className="mt-6">
                <VolunteersList 
                  eventId={event.id} 
                  eventTitle={event.title}
                  onVolunteerCountChange={setVolunteerCount}
                />
              </div>
            )}
          </div>

          {/* Footer with Register Button */}
          <div className="flex-shrink-0 border-t-2 border-[var(--color-border)] bg-[var(--color-mist)] p-6">
            {isRegistered ? (
              <button
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#22c55e] to-[#16a34a] px-6 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105"
                type="button"
                disabled
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                Registered!
              </button>
            ) : isQuotaFull && userRole === 'volunteer' ? (
              <button
                className="w-full rounded-2xl bg-gradient-to-r from-[#6b7280] to-[#4b5563] px-6 py-4 text-lg font-bold text-white shadow-lg cursor-not-allowed opacity-60"
                type="button"
                disabled
              >
                Quota Reached - Registration Closed
              </button>
            ) : (
              <button
                onClick={() => setShowRegistration(true)}
                className="w-full rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-6 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105"
                type="button"
              >
                Register for This Event
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Registration Flow Modal */}
      {showRegistration && (
        <RegistrationFlow
          eventTitle={event.title}
          eventId={event.id}
          userRole={userRole}
          onComplete={handleRegisterComplete}
          onCancel={() => setShowRegistration(false)}
        />
      )}
    </>
  );
}

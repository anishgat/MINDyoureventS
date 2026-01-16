'use client';

import { useState } from 'react';
import type { EventItem } from '@/lib/types/event';
import EventDetailsModal from './EventDetailsModal';
import { getEventImageByType } from '@/lib/utils/eventImages';
import { getEventColorClasses } from '@/lib/utils/eventColors';

type EventCarouselCardProps = {
  event: EventItem;
  isSignedUp: boolean;
  userRole?: string;
  onToggleSignup: (eventId: string) => void;
};

export default function EventCarouselCard({
  event,
  isSignedUp,
  userRole,
  onToggleSignup,
}: EventCarouselCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleRegister = async () => {
    await onToggleSignup(event.id);
  };

  // Get color classes for volunteers/admins
  const colorClasses = userRole === 'volunteer' || userRole === 'admin'
    ? (() => {
        if (event.volunteerEventType === 'experienced') {
          return getEventColorClasses('yellow');
        }
        if (event.volunteerEventType === 'quota_reached') {
          return getEventColorClasses('green');
        }
        if (event.volunteerEventType === 'volunteer_only') {
          return getEventColorClasses('blue');
        }
        return '';
      })()
    : '';

  const imageUrl = event.imageUrl || getEventImageByType(event.title, event.location);
  const fallbackGradient = 'bg-gradient-to-br from-[#3b82f6] via-[#22c55e] to-[#f97316]';

  return (
    <>
      <article
        className={`group relative flex-shrink-0 w-[320px] sm:w-[380px] md:w-[420px] lg:w-[450px] rounded-2xl overflow-hidden bg-white shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] ${colorClasses}`}
        onClick={() => setShowModal(true)}
      >
        {/* Image Section */}
        <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden bg-gray-200">
          {!imageError ? (
            <img
              src={imageUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className={`w-full h-full ${fallbackGradient} flex items-center justify-center`}>
              <svg
                className="h-16 w-16 text-white/80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Status Badge */}
          {isSignedUp && (
            <div className="absolute top-3 right-3 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              Registered
            </div>
          )}
          
          {/* Event Type Badge (for volunteers/admins) */}
          {(userRole === 'volunteer' || userRole === 'admin') && event.volunteerEventType && (
            <div className={`absolute top-3 left-3 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg ${
              event.volunteerEventType === 'experienced' ? 'bg-yellow-500' :
              event.volunteerEventType === 'quota_reached' ? 'bg-green-500' :
              event.volunteerEventType === 'volunteer_only' ? 'bg-blue-500' : ''
            }`}>
              {event.volunteerEventType === 'experienced' ? 'Experienced' :
               event.volunteerEventType === 'quota_reached' ? 'Quota Reached' :
               event.volunteerEventType === 'volunteer_only' ? 'Volunteer Event' : ''}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-[var(--color-ink)] line-clamp-2 mb-2">
            {event.title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-[var(--color-ink-soft)]">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-ink-soft)]">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-ink-soft)]">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          {/* Description Preview */}
          <p className="text-sm text-[var(--color-ink-soft)] line-clamp-2 mb-4">
            {event.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-3 text-xs text-[var(--color-ink-soft)]">
              <span className="font-semibold">{event.capacity} spots</span>
              {event.volunteerQuota && (userRole === 'volunteer' || userRole === 'admin') && (
                <span className="font-semibold">• {event.volunteerQuota} volunteers</span>
              )}
            </div>
            <button
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isSignedUp
                  ? 'bg-gray-100 text-[var(--color-ink-soft)]'
                  : 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)]'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              type="button"
            >
              {isSignedUp ? 'View Details' : 'Register'}
            </button>
          </div>
        </div>
      </article>

      {showModal && (
        <EventDetailsModal
          event={event}
          isSignedUp={isSignedUp}
          userRole={userRole as "admin" | "participant" | "volunteer" | undefined}
          onClose={() => setShowModal(false)}
          onRegister={handleRegister}
        />
      )}
    </>
  );
}

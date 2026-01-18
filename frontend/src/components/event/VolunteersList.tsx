'use client';

import { useEffect, useState } from 'react';
import { getVolunteersForEvent, initializeVolunteersForEvent } from '@/lib/api/volunteers';

type VolunteersListProps = {
  eventId: string;
  eventTitle: string;
  onVolunteerCountChange?: (count: number) => void;
};

export default function VolunteersList({ 
  eventId, 
  eventTitle, 
  onVolunteerCountChange 
}: VolunteersListProps) {
  const [volunteers, setVolunteers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVolunteers = async () => {
      // Initialize with 3 random names if not exists
      initializeVolunteersForEvent(eventId);
      const volunteerList = await getVolunteersForEvent(eventId);
      setVolunteers(volunteerList);
      setIsLoading(false);
      onVolunteerCountChange?.(volunteerList.length);
    };

    loadVolunteers();

    // Refresh volunteers list periodically
    const interval = setInterval(async () => {
      const volunteerList = await getVolunteersForEvent(eventId);
      setVolunteers(volunteerList);
      onVolunteerCountChange?.(volunteerList.length);
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [eventId, onVolunteerCountChange]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-white/80 p-4">
        <p className="text-sm text-[var(--color-ink-soft)]">Loading volunteers...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">Volunteers</h3>
        <span className="chip">{volunteers.length}</span>
      </div>
      {volunteers.length === 0 ? (
        <p className="text-xs text-[var(--color-ink-soft)]">No volunteers yet</p>
      ) : (
        <ul className="space-y-2">
          {volunteers.map((name, index) => (
            <li
              key={`${name}-${index}`}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-mist)] px-3 py-2 text-xs text-[var(--color-ink)]"
            >
              <svg
                className="h-4 w-4 text-[#3b82f6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-medium">{name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

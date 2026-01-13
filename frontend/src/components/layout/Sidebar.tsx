import type { EventItem } from '@/lib/types/event';

type SidebarProps = {
  signedEvents: EventItem[];
};

export default function Sidebar({ signedEvents }: SidebarProps) {
  return (
    <aside className="card grid-texture p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Lineup</h2>
        <span className="chip">{signedEvents.length} events</span>
      </div>
      <div className="mt-6 space-y-4">
        {signedEvents.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-soft)]">
            Pick an event to see it appear here. Your week will update in real time.
          </p>
        ) : (
          signedEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-[var(--color-border)] bg-white/80 p-4"
            >
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                {event.title}
              </p>
              <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                {event.date} {event.startTime}-{event.endTime}
              </p>
              <p className="mt-2 text-xs text-[var(--color-ink-soft)]">
                {event.location}
              </p>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

import type { EventItem } from '@/lib/types/event';

type SidebarProps = {
  signedEvents: EventItem[];
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ signedEvents, isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-30 bg-slate-950/30 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        aria-hidden={!isOpen}
        className={`fixed right-3 top-4 z-40 h-[calc(100vh-2rem)] w-[320px] transition duration-300 ease-out sm:w-[360px] ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-full opacity-0"
        }`}
      >
        <div className="card grid-texture flex h-full flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Your Lineup</h2>
              <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                Events you are signed up for this week.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="chip">{signedEvents.length} events</span>
              <button
                aria-label="Close lineup"
                className="btn btn-ghost"
                onClick={onClose}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-hide">
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
        </div>
      </aside>
    </>
  );
}

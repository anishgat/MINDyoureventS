import type { EventItem } from "@/lib/types/event";
import EventCard from "./EventCard";

type EventListProps = {
  events: EventItem[];
  signedEventIds: Set<string>;
  onToggleSignup: (eventId: string) => void;
};

export default function EventList({
  events,
  signedEventIds,
  onToggleSignup,
}: EventListProps) {
  return (
    <section className="space-y-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isSignedUp={signedEventIds.has(event.id)}
          onToggleSignup={onToggleSignup}
        />
      ))}
    </section>
  );
}

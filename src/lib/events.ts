// lib/events.ts
import type { EventItem, EventApiResponse } from '@/types/event';

export const EVENT_API_URL =
  process.env.NEXT_PUBLIC_EVENT_API_URL ?? 'https://prlab.vercel.app/api/event';

const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Returns today's calendar date string (YYYY-MM-DD) in Asia/Kolkata.
 */
export function getTodayInIST(now: Date = new Date()): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(now); // en-CA gives YYYY-MM-DD
}

/**
 * Returns YYYY-MM-DD for an ISO date string in Asia/Kolkata.
 * Returns null if the input is invalid.
 */
export function getISTCalendarDate(iso: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(d);
}

/**
 * True if the event's calendar date (Asia/Kolkata) is strictly before today (Asia/Kolkata).
 */
export function isPastEvent(event: EventItem, now: Date = new Date()): boolean {
  const eventDate = getISTCalendarDate(event.date);
  if (!eventDate) return false;
  const today = getTodayInIST(now);
  return eventDate < today; // lexicographic compare works for YYYY-MM-DD
}

/**
 * Filters + sorts events: only past events, newest first.
 * Pure function — safe to unit-test.
 */
export function filterPastEvents(events: EventItem[], now: Date = new Date()): EventItem[] {
  return events
    .filter((e) => isPastEvent(e, now))
    .sort((a, b) => {
      const ta = new Date(a.date).getTime();
      const tb = new Date(b.date).getTime();
      return tb - ta; // descending
    });
}

/**
 * Validates a raw object looks like an EventItem (minimum viable shape).
 */
function isValidEvent(x: unknown): x is EventItem {
  if (!x || typeof x !== 'object') return false;
  const e = x as Record<string, unknown>;
  return (
    typeof e._id === 'string' &&
    typeof e.title === 'string' &&
    typeof e.date === 'string'
  );
}

export interface FetchPastEventsResult {
  events: EventItem[];
  error: string | null;
}

/**
 * Server-side fetch + validate + filter. Never throws.
 */
export async function fetchPastEvents(
  now: Date = new Date()
): Promise<FetchPastEventsResult> {
  try {
    const res = await fetch(EVENT_API_URL, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return {
        events: [],
        error: `Event API responded with status ${res.status}.`,
      };
    }

    const json = (await res.json()) as EventApiResponse;

    if (!json || typeof json !== 'object' || json.success !== true) {
      return {
        events: [],
        error: json?.message || 'Event API returned an invalid response.',
      };
    }

    const raw = Array.isArray(json.data) ? json.data : [];
    const valid = raw.filter(isValidEvent);
    const past = filterPastEvents(valid, now);

    return { events: past, error: null };
  } catch (err) {
    return {
      events: [],
      error:
        err instanceof Error
          ? `Failed to reach event API: ${err.message}`
          : 'Failed to reach event API.',
    };
  }
}
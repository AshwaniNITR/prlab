// components/past-events-gallery.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react';
import EventCard from './event-card';
import { filterPastEvents } from '@/lib/events';
import type { EventItem } from '@/types/event';

interface Props {
  initialEvents: EventItem[];
  initialError: string | null;
}

const EVENT_API_URL =
  process.env.NEXT_PUBLIC_EVENT_API_URL ?? 'https://prlab.vercel.app/api/event';

const TOTAL_VISIBLE = 7;
const RADIUS_STEP = 260;
const MAX_ROTATE = 55;
const MAX_DEPTH = 380;
const MIN_SCALE = 0.72;
const WAVE_AMPLITUDE = 22;

const SPRING = { type: 'spring', stiffness: 140, damping: 22, mass: 0.9 } as const;

export default function PastEventsGallery({ initialEvents, initialError }: Props) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [error, setError] = useState<string | null>(initialError);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(TOTAL_VISIBLE);

  const isAnimating = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 640) return 3;
      if (w < 1024) return 5;
      return 7;
    };
    const update = () => setVisibleCount(compute());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const total = events.length;
  const single = total === 1;

  useEffect(() => {
    if (total === 0) return;
    if (active >= total) setActive(0);
  }, [total, active]);

  const next = useCallback(() => {
    if (total < 2 || isAnimating.current) return;
    isAnimating.current = true;
    setActive((a) => (a + 1) % total);
    window.setTimeout(() => {
      isAnimating.current = false;
    }, 220);
  }, [total]);

  const prev = useCallback(() => {
    if (total < 2 || isAnimating.current) return;
    isAnimating.current = true;
    setActive((a) => (a - 1 + total) % total);
    window.setTimeout(() => {
      isAnimating.current = false;
    }, 220);
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (total < 2) return;
    const threshold = 40;
    if (info.offset.x < -threshold || info.velocity.x < -400) next();
    else if (info.offset.x > threshold || info.velocity.x > 400) prev();
  };

  const retry = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(EVENT_API_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json?.success || !Array.isArray(json.data)) {
        throw new Error(json?.message || 'Invalid response');
      }
      const valid = (json.data as EventItem[]).filter(
        (e) =>
          e &&
          typeof e._id === 'string' &&
          typeof e.title === 'string' &&
          typeof e.date === 'string'
      );
      const past = filterPastEvents(valid);
      setEvents(past);
      setActive(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refetch events.');
    } finally {
      setLoading(false);
    }
  }, []);

  const isMobile = visibleCount <= 3;
  const step = isMobile ? 150 : visibleCount <= 5 ? 200 : RADIUS_STEP;
  const rotateMax = isMobile ? 38 : MAX_ROTATE;
  const depthMax = isMobile ? 200 : MAX_DEPTH;

  // How many slots to render on each side of the active card.
  // If total is 1, this is 0 → only one slot, always at center.
  const halfWindow = Math.min(Math.floor(visibleCount / 2), Math.max(total - 1, 0));

  const slots = useMemo(() => {
    if (total === 0) return [];
    const arr: Array<{ index: number; distance: number }> = [];
    const seen = new Set<number>();
    for (let d = -halfWindow; d <= halfWindow; d++) {
      const index = (active + d + total) % total;
      if (seen.has(index)) continue;
      seen.add(index);
      arr.push({ index, distance: d });
    }
    return arr;
  }, [active, total, halfWindow]);

  return (
    <div className="relative w-full">
      {/* STAGE */}
      <div
        className="relative mx-auto flex h-[420px] w-full items-center justify-center sm:h-[480px] lg:h-[540px]"
        style={{ perspective: '2000px', perspectiveOrigin: '50% 45%' }}
        aria-roledescription="carousel"
        aria-label="Past events gallery"
      >
        {loading && total === 0 && (
          <div className="text-sm text-gray-500">Loading events…</div>
        )}

        {!loading && total === 0 && (
          <EmptyOrError error={error} onRetry={retry} />
        )}

        {total > 0 && (
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: 'preserve-3d' }}
            onPanEnd={onDragEnd}
          >
            <AnimatePresence initial={false}>
              {slots.map(({ index, distance }) => {
                const ev = events[index];
                const absDist = Math.abs(distance);

                // With a single event, lock everything to center.
                if (single) {
                  return (
                    <motion.div
                      key={ev._id}
                      className="absolute left-1/2 top-1/2 will-change-transform"
                      style={{
                        width: isMobile ? 200 : visibleCount <= 5 ? 240 : 280,
                        zIndex: 100,
                        transformStyle: 'preserve-3d',
                      }}
                      initial={false}
                      animate={{
                        x: '-50%',
                        y: '-50%',
                        z: 0,
                        rotateY: 0,
                        scale: 1,
                        opacity: 1,
                      }}
                      transition={SPRING}
                    >
                      <EventCard event={ev} emphasis="active" />
                    </motion.div>
                  );
                }

                // Multi-event layout (signed distance: negative = left, positive = right)
                const sign = Math.sign(distance) || 0;
                const denom = halfWindow || 1;

                const x = distance * step;
                const rotateY = reduced ? 0 : sign * (absDist / denom) * rotateMax;
                const z = -absDist * (depthMax / (denom + 1));
                const y = reduced ? 0 : -Math.sin((absDist / denom) * Math.PI) * WAVE_AMPLITUDE;

                const scale = absDist === 0 ? 1 : Math.max(MIN_SCALE, 1 - absDist * 0.07);
                const opacity = absDist === 0 ? 1 : Math.max(0.4, 1 - absDist * 0.14);
                const zIndex = 100 - absDist;

                const emphasis: 'active' | 'near' | 'far' =
                  absDist === 0 ? 'active' : absDist <= 2 ? 'near' : 'far';

                const delay = reduced ? 0 : Math.min(absDist * 0.03, 0.09);

                return (
                  <motion.div
                    key={ev._id}
                    className="absolute left-1/2 top-1/2 will-change-transform"
                    style={{
                      width: isMobile ? 180 : visibleCount <= 5 ? 220 : 260,
                      zIndex,
                      transformStyle: 'preserve-3d',
                    }}
                    initial={false}
                    animate={{
                      x: `calc(-50% + ${x}px)`,
                      y: `calc(-50% + ${y}px)`,
                      z,
                      rotateY,
                      scale,
                      opacity,
                    }}
                    transition={{ ...SPRING, delay }}
                  >
                    <EventCard event={ev} emphasis={emphasis} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* NAVIGATION */}
      {total > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <NavButton direction="prev" onClick={prev} disabled={total < 2} />
          <p className="min-w-[80px] text-center text-xs tabular-nums text-gray-500">
            {active + 1} / {total}
          </p>
          <NavButton direction="next" onClick={next} disabled={total < 2} />
        </div>
      )}
    </div>
  );
}

function NavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
}) {
  const label = direction === 'prev' ? 'Previous event' : 'Next event';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-800 shadow-sm transition-all hover:border-blue-600 hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
    >
      {direction === 'prev' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </button>
  );
}

function EmptyOrError({
  error,
  onRetry,
}: {
  error: string | null;
  onRetry: () => void;
}) {
  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-black">Couldn&apos;t load events</h2>
        <p className="mb-6 text-sm text-gray-500">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }
  return (
    <div className="text-center">
      <p className="text-gray-500 italic">No past events to showcase just yet.</p>
    </div>
  );
}
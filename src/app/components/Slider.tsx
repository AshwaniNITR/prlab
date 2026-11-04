"use client";
import React, { useEffect, useState } from "react";

type EventItem = {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const COPIES = 8;

export default function EventSlider() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/event", {
          cache: "no-store",
        });
        const json = await res.json();
        if (!cancelled && json?.success) setEvents(json.data ?? []);
      } catch {
        if (!cancelled) setError("Failed to load events");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const track = Array.from({ length: COPIES }, () => events).flat();

  return (
    <section className="relative w-full overflow-hidden bg-white py-12">
      <style>{`
        @keyframes eventMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-100% / ${COPIES})); }
        }
        .event-marquee {
          display: flex;
          width: max-content;
          animation: eventMarquee var(--event-speed, 40s) linear infinite;
        }
        .event-marquee:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .event-marquee { animation: none; }
        }
      `}</style>

      {loading && (
        <div className="mx-auto max-w-6xl px-6 font-mono text-xs uppercase tracking-[0.3em] text-[#0a1020]/40">
          Loading events…
        </div>
      )}
      {error && !loading && (
        <div className="mx-auto max-w-6xl px-6 font-mono text-xs uppercase tracking-[0.3em] text-red-500">
          {error}
        </div>
      )}

      {!loading && !error && track.length > 0 && (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-white" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-white" />

          <div
            className="event-marquee gap-4 px-6"
            style={{
              ["--event-speed" as string]: `${Math.max(30, events.length * 18)}s`,
            }}
          >
            {track.map((ev, i) => (
              <article
                key={`${ev._id}-${i}`}
                className="group relative w-[200px] shrink-0 overflow-hidden border border-[#0a1020]/15 bg-white transition-colors hover:border-[#0a1020]/40 md:w-[240px]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0a1020]/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ev.image}
                    alt={ev.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-2 top-2 border border-[#0a1020]/20 bg-white px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#0a1020]/70">
                    {formatDate(ev.date)}
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-[#0a1020]">
                    {ev.title}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#0a1020]/50">
                    <span>{ev.time}</span>
                    <span className="h-1 w-1 bg-yellow-400" />
                    <span className="line-clamp-1">{ev.location}</span>
                  </div>
                </div>

                <span className="pointer-events-none absolute bottom-1.5 right-1.5 h-2.5 w-2.5 border-b border-r border-[#0a1020]/30" />
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
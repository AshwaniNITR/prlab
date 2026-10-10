// components/event-card.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { EventItem } from '@/types/event';

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatEventDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return dateFormatter.format(d);
}

interface EventCardProps {
  event: EventItem;
  /** "active" | "near" | "far" — controls text emphasis */
  emphasis?: 'active' | 'near' | 'far';
}

export default function EventCard({ event, emphasis = 'near' }: EventCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = Boolean(event.image) && !imgFailed;

  const titleClass =
    emphasis === 'active'
      ? 'text-black'
      : emphasis === 'near'
      ? 'text-gray-800'
      : 'text-gray-600';

  const dateClass =
    emphasis === 'active'
      ? 'text-gray-500'
      : emphasis === 'near'
      ? 'text-gray-500'
      : 'text-gray-400';

  return (
    <div className="flex h-full w-full select-none flex-col">
      {/* Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.35)]">
        {hasImage ? (
          <Image
            src={event.image as string}
            alt={event.title || 'Event image'}
            fill
            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 22vw"
            className="object-cover"
            draggable={false}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <svg
              className="h-10 w-10 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="mt-4 px-1">
        <h3
          className={`truncate text-sm font-medium tracking-tight sm:text-[15px] ${titleClass}`}
          title={event.title}
        >
          {event.title}
        </h3>
        <p className={`mt-1 text-xs tabular-nums sm:text-[13px] ${dateClass}`}>
          {formatEventDate(event.date)}
        </p>
      </div>
    </div>
  );
}
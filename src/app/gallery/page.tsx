// app/page.tsx
import { fetchPastEvents } from '@/lib/events';
import PastEventsGallery from '@/app/components/past-events-gallery';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const { events, error } = await fetchPastEvents();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero — same rhythm as Teams page */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Gallery
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-blue-100">
              Explore the workshops, experiences, and events that brought our
              community together.
            </p>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PastEventsGallery initialEvents={events} initialError={error} />
      </div>


    </div>
  );
}
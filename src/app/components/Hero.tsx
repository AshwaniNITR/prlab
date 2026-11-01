"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Poppins } from "next/font/google";
import About from "../components/About";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SLIDE_MS = 4000;

const Hero = () => {
  // Images and tab labels are index-matched. Add a label when you add an image.
  const images = [
    "/campusnew.jpeg",
    "deptnew.jpeg",
    "/prlabnew.jpeg",
    "/milab.jpeg",
    // Add more images as needed
  ];
  const tabLabels = [
    "Campus",
    "Department",
    "Pattern Recognition Lab",
    "Machine Intelligence Lab",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance the carousel (restarts whenever the slide changes,
  // so manual clicks always get a full 4s before the next auto-advance)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, SLIDE_MS);
    return () => clearInterval(interval);
  }, [images.length, currentImageIndex]);

  const goPrev = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);

  return (
    <>
      <style>{`
        @keyframes slideProgress { from { width: 0%; } to { width: 100%; } }
        @media (prefers-reduced-motion: reduce) {
          .slide-progress { animation: none !important; width: 100% !important; }
        }
      `}</style>

      {/*
        The hero is a flex column: header -> main text -> tabs.
        Nothing inside is absolutely positioned except the background
        layers and arrows, so content can never overlap. If the content is
        taller than the screen, the hero simply grows (min-h, not h).
      */}
      <div
        id="home"
        className={`${poppins.className} relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#0a1020]`}
      >
        {/* Image Carousel */}
        <div className="absolute inset-0">
          {images.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="h-full w-full object-cover object-right"
              />
            </div>
          ))}
        </div>

        {/* Dark shadow over the left side (uniform on small screens) */}
        <div className="absolute inset-0 z-[1] bg-[#0a1020]/75 md:bg-transparent" />
        <div className="absolute inset-y-0 left-0 z-[1] hidden w-[70%] bg-gradient-to-r from-[#0a1020] via-[#0a1020]/90 to-transparent md:block" />
        {/* Soft shade at the bottom so the tabs stay readable */}
        <div className="absolute inset-x-0 bottom-0 z-[1] h-48 bg-gradient-to-t from-[#0a1020]/85 to-transparent" />

        {/* Header: logos + department. Hidden on phones.
            pt-28 / md:pt-32 leaves room for the fixed navbar. */}
        <header className="relative z-10 hidden items-center gap-4 px-10 pt-28 sm:flex md:gap-5 md:pt-32 lg:px-[5.5rem]">
          <img
            src="/nitrlogo.png"
            alt="NIT Rourkela"
            className="h-16 w-16 shrink-0 rounded-md bg-white object-contain p-0.5 md:h-20 md:w-20"
          />
          <span className="h-16 w-px shrink-0 bg-white/30 md:h-20" />
          <img
            src="/ip-logo.jpg"
            alt="IntelliPattern Lab"
            className="h-16 w-auto shrink-0 object-contain md:h-20"
          />
          <span className="h-16 w-px shrink-0 bg-white/30 md:h-20" />
          <div className="text-white">
            <p className="text-xs font-medium uppercase leading-snug tracking-wide md:text-base">
              Department of Electronics and
              <br />
              Communication Engineering
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/70 md:text-xs">
              National Institute of Technology Rourkela
            </p>
          </div>
        </header>

        {/* Main text content (takes the remaining height, centred) */}
        <section className="relative z-10 flex flex-1 items-start px-5 pb-8 pt-28 sm:items-center sm:px-10 sm:py-8 lg:px-[5.5rem]">
          <div className="w-full max-w-2xl">
            <h1 className="text-[2rem] font-bold leading-tight sm:text-5xl lg:text-6xl">
              <span className="text-yellow-400">IntelliPattern</span>{" "}
              <span className="text-white">Lab</span>
            </h1>

            <p className="mt-2 text-sm font-semibold italic text-white sm:mt-3 sm:text-lg lg:text-xl">
              Pattern Recognition and Machine Intelligence Laboratory
            </p>

            {/* Gradient underline */}
            <div className="mt-4 h-1 w-full max-w-[26rem] rounded-full bg-gradient-to-r from-yellow-400 via-lime-200/70 to-blue-500 sm:mt-5 lg:max-w-[28rem]" />

            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/90 sm:mt-7 sm:text-base lg:text-lg">
              Advancing intelligent systems through machine learning, computer
              vision, signal processing and pattern recognition.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
              <a
                href="#research"
                className="inline-flex items-center gap-2 rounded-md bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-[#0a1020] transition hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1020] sm:gap-3 sm:px-6 sm:py-3 sm:text-base"
              >
                Explore Research
                <ArrowRight size={18} />
              </a>
              <a
                href="#team"
                className="inline-flex items-center gap-2 rounded-md border border-white/80 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1020] sm:gap-3 sm:px-6 sm:py-3 sm:text-base"
              >
                Meet the Team
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* Prev / Next arrows (hidden on phones) */}
        <button
          onClick={goPrev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 sm:flex"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goNext}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 sm:flex"
        >
          <ChevronRight size={20} />
        </button>

        {/* Bottom tabs: in normal flow, so they sit below the text */}
        <nav
          aria-label="Slides"
          className="relative z-20 px-5 pb-6 pt-2 sm:px-10 lg:px-[5.5rem]"
        >
          {/* Phones: show only the active slide's name above the 4 bars */}
          <p className="mb-3 text-sm font-semibold text-white sm:hidden">
            {tabLabels[currentImageIndex] ?? `Slide ${currentImageIndex + 1}`}
          </p>

          <ul className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:items-end sm:gap-x-8 sm:gap-y-3">
            {images.map((_, index) => {
              const active = index === currentImageIndex;
              return (
                <li key={index} className="sm:min-w-[7rem]">
                  <button
                    onClick={() => setCurrentImageIndex(index)}
                    aria-current={active}
                    aria-label={tabLabels[index] ?? `Slide ${index + 1}`}
                    className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`rounded-md border px-1.5 py-0.5 text-xs font-semibold ${
                          active
                            ? "border-yellow-400 text-yellow-400"
                            : "border-white/50 text-white/70"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`hidden text-base font-semibold sm:inline ${
                          active ? "text-white" : "text-white/80"
                        }`}
                      >
                        {tabLabels[index] ?? `Slide ${index + 1}`}
                      </span>
                    </span>
                    <span className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-white/25 sm:mt-3">
                      {active && (
                        <span
                          key={currentImageIndex}
                          className="slide-progress block h-full rounded-full bg-yellow-400"
                          style={{
                            animation: `slideProgress ${SLIDE_MS}ms linear forwards`,
                          }}
                        />
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* <About /> */}
    </>
  );
};

export default Hero;
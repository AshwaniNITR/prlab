"use client";
import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

const Hero = () => {
  const images = [
    "/newDept.jpeg",
    "/image 8.png",
    // Add more images as needed
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Auto-advance the carousel
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div id="home" className="relative h-screen overflow-hidden">
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
              className="w-full h-full object-cover object-center"
              style={{ height: "100dvh" }}
            />
          </div>
        ))}
      </div>

      {/* Text Content with Blurred Background */}
      <section className="relative w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto w-full">
          {/* Main container with blurred background */}
          <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/20 shadow-2xl">
            {/* Gradient text content */}
            <div className="text-center space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide leading-tight bg-gradient-to-r bg-yellow-400 bg-clip-text text-transparent">
                Pattern Recognition And Machine Intelligence Lab
              </h1>
              
              <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
                <div className="flex items-center justify-center gap-3">
                  <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-white flex-shrink-0" />
                  <p className="text-white text-sm sm:text-base md:text-lg font-semibold text-center leading-relaxed">
                    Department of Electronics and Communication Engineering<br />
                    National Institute of Technology (NIT), Rourkela.<br />
                    Rourkela, Odisha, India - 769008
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? "bg-yellow-400 scale-125" 
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
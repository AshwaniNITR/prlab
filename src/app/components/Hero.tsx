"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Calendar, MapPin } from "lucide-react";

const Hero = () => {
  const images = [
    "/ecDept2.jpg",
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

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div
      id="home"
      className="relative h-screen overflow-hidden"
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
              className="w-full h-full object-cover object-center"
              style={{ height: "100dvh" }}
            />
          </div>
        ))}
      </div>

      {/* Text Content - Fixed centering */}
      <section className="relative w-full h-full flex items-center justify-center xl:py-48 md:py-32 px-6 sm:px-8 py-36 lg:px-12 
        text-transparent bg-clip-text 
        bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500
        z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="p-6 rounded-lg">
            <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide leading-tight mb-8">
              Pattern And Recognition Lab
            </p>
           
            <div className="flex flex-col sm:flex-row justify-center items-start gap-2 text-sm md:text-lg">
              <div className="flex justify-center items-start gap-2">
                <MapPin className="h-8 w-8 text-yellow-600" />
                <span className="font-extrabold text-center">
                  Department of Electronics and Communication Engineering <br />
                  National Institute of Technology (NIT), Rourkela. <br />
                  Rourkela, Odisha, India - 769008
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Arrows (Optional) */}
      {/* <button 
        onClick={goToPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button> */}

      {/* Dots Indicator (Optional) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentImageIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
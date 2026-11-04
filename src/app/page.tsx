"use client"

import About from "./components/About";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import EventSlider from "./components/Slider";


export default function Home() {
  return (
    <div className="min-h-screen ">
     
      <Hero/>
      <EventSlider/>
      <About/>
      <Profile/>
    </div>
  );
}

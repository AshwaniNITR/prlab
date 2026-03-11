"use client"

import About from "./components/About";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-100">
     
      <Hero/>
      <About/>
      {/* <Footer/> */}
      <Profile/>
    </div>
  );
}

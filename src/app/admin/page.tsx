"use client"

import About from "./components/About";


import Navbar from "./components/Navbar";
import Dashboard from "./dashboard/page";



export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-100">
      <Dashboard/>  
      <About/>
    </div>
  );
}

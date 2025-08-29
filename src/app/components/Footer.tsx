"use client";

import { Mail, MapPin } from "lucide-react";
import Navbar from "./Navbar";

export default function Footer() {
  return (
    <div id="contactus" className="bg-white relative z-10">
      <Navbar/>
      
      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-8 rounded-t-3xl relative z-20">
        <div className="container mx-auto flex flex-col items-center justify-center text-center my-5 px-6">
          {/* Conference Details */}
          <div className="flex flex-col items-center mb-6">
            <h3 className="text-xl font-bold uppercase tracking-wide mb-2">
              Pattern And Recognition Lab
            </h3>
          </div>

          {/* Location Section */}
          <div className="w-full max-w-2xl mb-6">
            <div className="flex flex-col items-center justify-center bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-lg font-semibold">Location</span>
              </div>
              
              <div className="text-sm text-gray-300 space-y-1">
                <p>Department of Electronics and Communication Engineering</p>
                <p>National Institute of Technology (NIT), Rourkela</p>
                <p>Rourkela, Odisha, India - 769008</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-sm mb-6 flex flex-col items-center">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-lg font-semibold">Contact Us</span>
            </div>
            <p className="mt-2 text-gray-300">PR@nitrkl.ac.in</p>
          </div>
        </div>
        
        <div className="w-[98%] h-0.5 bg-gray-700 mx-auto mt-2 mb-4"></div>

        {/* Footer Bottom - Similar to CVBL style */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-gray-400 text-sm mb-2">©PR-Lab, NIT Rourkela</div>
          
        </div>
      </footer>
    </div>
  );
}
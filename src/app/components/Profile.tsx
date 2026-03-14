import React, { useState } from "react";
import { Linkedin, GraduationCap, Globe, X, Mail } from "lucide-react";

const Profile = () => {
  const [activeModal, setActiveModal] = useState<"about" | "research" | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div className=" bg-slate-50 flex items-center justify-center p-4">
      {/* Main card - cleaner design with subtle border */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-3xl overflow-hidden border border-slate-200">
        {/* Header section with subtle gradient */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-50 px-8 pt-8 pb-6 border-b border-slate-100">
          <div className="flex flex-col items-center">
            {/* Profile image with subtle border */}
            <div className="w-28 h-28 rounded-full bg-slate-200 mb-4 ring-4 ring-white shadow-sm overflow-hidden">
              <img 
                src="/prlab.jpg" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Name and designation - refined typography */}
            <h1 className="text-3xl font-semibold text-slate-800 mb-1">Samit Ari</h1>
            <p className="text-base font-semibold text-slate-500  tracking-wide">Professor</p>
            <p className="text-base text-center text-slate-500 font-medium tracking-wide">Department of Electronics and Communication Engineering</p>
            <p className="text-base text-center text-slate-500 font-medium tracking-wide">National Institute of Technology Rourkela</p>
            
            
            {/* Social links - cleaner icon styling */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <a 
                href="https://in.linkedin.com/in/samit-ari-770171285" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://scholar.google.com/citations?user=UC5vz1IAAAAJ&hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
              >
                <GraduationCap className="w-5 h-5" />
              </a>
              <a 
                href="https://www.nitrkl.ac.in/EC/~samit/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
              >
                <Globe className="w-5 h-5" />
              </a>
               <a 
                href="mailto:samit@nitrkl.ac.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
              >
                <Mail className="w-5 h-5"/>
              </a>

            </div>
          </div>
        </div>

        {/* Action buttons - professional styling */}
        <div className="px-8 py-6 bg-white flex justify-center gap-3">
          <button 
            onClick={() => setActiveModal("about")}
            className="px-5 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
          >
            About
          </button>
          <button 
            onClick={() => setActiveModal("research")}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            Research Areas
          </button>
        </div>
      </div>

      {/* About Modal - refined design */}
      {activeModal === "about" && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-semibold text-slate-800">About Samit Ari</h2>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal content */}
            <div className="px-6 py-5 overflow-y-auto max-h-[calc(85vh-8rem)]">
              <div className="text-slate-600 space-y-4 text-sm leading-relaxed">
                <p>
                  Dr. Samit Ari joined the National Institute of Technology Rourkela, as a faculty member in 2009, where he presently holds the position of professor in the department of Electronics and Communication Engineering. He also serves as Associate Dean, SRICCE (Sponsored Research, Industrial Consultancy and Continuing Education).
                </p>
                <p>
                  Previously, he also served several administrative positions, like Associate Dean, Academic (Undergraduate) from July 2022 to June 2025, Prof.-in-Charge and Coordinator, Accreditation and Ranking Cell from July 2020 to June 2023, and Vice-President, Student Activity Centre (Games and Sports) from July 2018 to June 2020.
                </p>
                <p>
                  He is the Prof.-in-Charge of Pattern Recognition and Machine Intelligence Laboratory and head of this laboratory research group. Prof. Ari is a senior member of IEEE and a member of the IEEE Signal Processing Society. He was also Associate Editor of IET Image Processing Journal during 2019-2022.
                </p>
                <p>
                  He has already published more than 130 research articles, including IEEE transactions, Elsevier journals, etc., and his Google Scholar h-index is 29 with 2800+ citations. His two patents were granted and also another two patents are published in the domain of machine intelligence, signal and image processing.
                </p>
                <p>
                  He was awarded as Young Faculty Research Fellow under the Visvesvaraya PhD scheme for Electronics & IT, MeitY, for the year of 2015-16 and got recognition from ICMR and National Innovation Foundation India for innovation and contribution in the field of science and technology in the year of 2015. He received SERB Start up Research grant for Young Scientists, 2012. He received several best paper awards in different conferences, namely IEEE-ICCECE-2020, ICMACC-2022 and ICSTSN 2023, etc.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Research Areas Modal - refined design */}
      {activeModal === "research" && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden">
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-semibold text-slate-800">Research Areas</h2>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal content */}
            <div className="px-6 py-5">
              <ul className="space-y-3">
                {[
                  "Machine Learning",
                  "Artificial Intelligence",
                  "Pattern Recognition",
                  "Signal Processing",
                  "Image Processing"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-700">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
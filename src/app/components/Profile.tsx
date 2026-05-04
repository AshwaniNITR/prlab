import React from "react";
import { Linkedin, GraduationCap, Globe, Mail } from "lucide-react";

const Profile = () => {
  const titles = [
    "Professor",
    "Associate Dean, SRICCE",
    "Department of Electronics and Communication Engineering",
    "National Institute of Technology Rourkela",
  ];

  const researchAreas = [
    "Machine Learning",
    "Artificial Intelligence",
    "Pattern Recognition",
    "Signal Processing",
    "Image Processing",
  ];

  return (
    <div className="bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-md w-full max-w-5xl overflow-hidden border border-slate-200 flex min-h-[500px]">

        {/* LEFT COLUMN */}
        <div className="w-72 flex-shrink-0 border-r border-slate-100 bg-slate-50 px-6 py-8 flex flex-col items-center">
          <div className="w-28 h-28 rounded-xl bg-slate-200 overflow-hidden border border-slate-200 mb-5">
            <img src="/prlab.jpg" alt="Profile" className="w-full h-full object-cover" />
          </div>

          <p className="text-xl font-semibold text-slate-800 text-center mb-1">Samit Ari</p>

          {/* Designations */}
          <div className="w-full mb-5">
            {titles.map((title, i) => (
              <div key={i} className="flex items-center justify-center py-1">
                <span className={`text-sm text-slate-500 text-center ${i === 0 || i === 1 ? "font-semibold" : ""}`}>
                  {title}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full border-t border-slate-200 mb-4" />

          {/* Research Areas */}
          <div className="w-full">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Research Areas</p>
            <ul className="space-y-2">
              {researchAreas.map((area, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons */}
          <div className="flex gap-2.5 mt-auto pt-6">
            {[
              { href: "https://in.linkedin.com/in/samit-ari-770171285", Icon: Linkedin },
              { href: "https://scholar.google.com/citations?user=UC5vz1IAAAAJ&hl=en", Icon: GraduationCap },
              { href: "https://www.nitrkl.ac.in/EC/~samit/", Icon: Globe },
              { href: "mailto:samit@nitrkl.ac.in", Icon: Mail },
            ].map(({ href, Icon }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN — About only */}
        <div className="flex-1 flex flex-col p-8">
          <p className="text-base font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-5">About</p>

          <div className="text-base text-slate-500 leading-relaxed space-y-3">
            <p>Dr. Samit Ari joined the National Institute of Technology Rourkela, as a faculty member in 2009, where he presently holds the position of professor in the department of Electronics and Communication Engineering. He also serves as Associate Dean, SRICCE (Sponsored Research, Industrial Consultancy and Continuing Education).</p>
            <p>Previously, he also served several administrative positions, like Associate Dean, Academic (Undergraduate) from July 2022 to June 2025, Prof.-in-Charge and Coordinator, Accreditation and Ranking Cell from July 2020 to June 2023, and Vice-President, Student Activity Centre (Games and Sports) from July 2018 to June 2020.</p>
            <p>He is the Prof.-in-Charge of Pattern Recognition and Machine Intelligence Laboratory and head of this laboratory research group. Prof. Ari is a senior member of IEEE and a member of the IEEE Signal Processing Society. He was also Associate Editor of IET Image Processing Journal during 2019-2022.</p>
            <p>He has already published more than 130 research articles, including IEEE transactions, Elsevier journals, etc., and his Google Scholar h-index is 29 with 2800+ citations. His two patents were granted and also another two patents are published in the domain of machine intelligence, signal and image processing.</p>
            <p>He was awarded as Young Faculty Research Fellow under the Visvesvaraya PhD scheme for Electronics & IT, MeitY, for the year of 2015-16 and got recognition from ICMR and National Innovation Foundation India for innovation and contribution in the field of science and technology in the year of 2015. He received SERB Start up Research grant for Young Scientists, 2012. He received several best paper awards in different conferences, namely IEEE-ICCECE-2020, ICMACC-2022 and ICSTSN 2023, etc.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
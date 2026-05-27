"use client";

import React, { useEffect, useState } from "react";
import { Linkedin, GraduationCap, Globe, Mail } from "lucide-react";

interface SocialLink {
  href: string;
  Icon: React.ElementType;
  label: string;
}

interface AboutData {
  id: number;
  content: string[];
}

const Profile: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const titles: string[] = [
    "Professor",
    "Associate Dean, SRICCE",
    "Department of Electronics and Communication Engineering",
    "National Institute of Technology Rourkela",
  ];

  const researchAreas: string[] = [
    "Machine Learning",
    "Artificial Intelligence",
    "Pattern Recognition",
    "Signal Processing",
    "Image Processing",
  ];

  const socialLinks: SocialLink[] = [
    {
      href: "https://in.linkedin.com/in/samit-ari-770171285",
      Icon: Linkedin,
      label: "LinkedIn",
    },
    {
      href: "https://scholar.google.com/citations?user=UC5vz1IAAAAJ&hl=en",
      Icon: GraduationCap,
      label: "Google Scholar",
    },
    {
      href: "https://www.nitrkl.ac.in/EC/~samit/",
      Icon: Globe,
      label: "Personal Website",
    },
    {
      href: "mailto:samit@nitrkl.ac.in",
      Icon: Mail,
      label: "Email",
    },
  ];

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/profile");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setAboutContent(result.data.content);
        } else {
          setError(result.message || "No about content found");
        }
      } catch (err) {
        console.error("Error fetching about content:", err);
        setError("Failed to load about content");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-md w-full max-w-5xl overflow-hidden border border-slate-200 flex flex-col lg:flex-row">
        {/* LEFT COLUMN - Profile Sidebar */}
        <div className="w-full lg:w-72 lg:flex-shrink-0 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50 px-6 py-8 flex flex-col items-center">
          {/* Profile Image */}
          <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-blue-100 to-slate-200 overflow-hidden border-2 border-white shadow-sm mb-5">
            <img
              src="/prlab.jpg"
              alt="Prof. Samit Ari"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://ui-avatars.com/api/?name=Samit+Ari&background=3b82f6&color=fff&size=112";
              }}
            />
          </div>

          <p className="text-xl font-semibold text-slate-800 text-center mb-1">
            Samit Ari
          </p>

          {/* Designations */}
          <div className="w-full mb-5 space-y-1">
            {titles.map((title, i) => (
              <div key={i} className="flex items-center justify-center py-0.5">
                <span
                  className={`text-sm text-slate-500 text-center ${
                    i === 0 || i === 1 ? "font-semibold text-slate-700" : ""
                  }`}
                >
                  {title}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full border-t border-slate-200 mb-4" />

          {/* Research Areas */}
          <div className="w-full">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Research Areas
            </p>
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
            {socialLinks.map(({ href, Icon, label }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - About Section */}
        <div className="flex-1 flex flex-col p-6 sm:p-8">
          <h2 className="text-base font-semibold text-slate-700 border-b border-slate-100 pb-3 mb-5">
            About
          </h2>

          <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3">
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-pulse text-slate-400">Loading...</div>
              </div>
            )}
            
            {error && (
              <div className="text-red-500 bg-red-50 p-4 rounded-lg">
                {error}
              </div>
            )}
            
            {!loading && !error && aboutContent.length > 0 && (
              aboutContent.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            )}
            
            {!loading && !error && aboutContent.length === 0 && (
              <p className="text-slate-400 italic">No about content available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
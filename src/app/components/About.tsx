// components/about.tsx
import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-800">About Our Research Lab</h2>
        
        {/* Mission & Vision Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-blue-700 border-b-2 border-blue-200 pb-2">Mission & Vision</h3>
          <p className="text-lg mb-6 text-black">
            Promote learning and system development in the field of Computer Vision and Biometrics. The research community will be constantly working to exchange ideas and become accustomed to the field through formal interactions with the experts of the domain.
          </p>
          <p className="text-lg mb-6 text-black">
            The lab will work as a channel to bring project funding from Government and Private sectors, which will facilitate member students, faculty and researchers to work on the real world problems in a collaborative environment.
          </p>
        </div>

        {/* Core Objectives Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-blue-700 border-b-2 border-blue-200 pb-2">Core Objectives</h3>
          <p className="text-lg mb-6 text-black">
            The Lab will provide a platform to the students, faculty and research fellows to work together and initiate teaching and research activities in the area to unveil various concepts, and tools.
          </p>
          <p className="text-lg mb-6 text-black">
            The center will provide a common ground to the research community to discover challenges and possible solutions in computer vision.
          </p>
          <p className="text-lg mb-8 text-black">
            Teaching and learning will be the backbone of the future research activities, which would involve all stake holders.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-4 text-blue-600">Contributions</h4>
              <ul className="list-disc pl-5 space-y-2 text-black">
                <li>Enhancing quality education with emphasis on domain specific expertise</li>
                <li>Grooming and nurturing young talent with opportunities and guidance</li>
                <li>Promoting research by investigating problems solvable with available tools</li>
                <li>Identifying problems where computer vision, ML and biometrics provide solutions</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-4 text-blue-600">Research Fields</h4>
              <ul className="space-y-2 text-black">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Machine Learning
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Computer Vision
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Biometrics
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Image Processing
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Capabilities Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-blue-700 border-b-2 border-blue-200 pb-2">Lab Capabilities</h3>
          <div className="bg-white p-6 rounded-lg shadow-md text-black">
            <ul className="grid md:grid-cols-2 gap-4 list-disc pl-5">
              <li>Establish infrastructure mostly through research funding</li>
              <li>Leverage campus and state collaborations for mutual benefit</li>
              <li>Provide seamless support between student service areas</li>
              <li>Productively involve both staff and faculty</li>
              <li>Expand into new and emerging technologies</li>
              <li>Focus on education, assessment, undergraduate research, etc.</li>
              <li>Collaborate with faculty, staff, students, and community members</li>
              <li>Support community-based teaching, learning, and scholarship</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
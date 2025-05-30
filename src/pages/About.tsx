import React from 'react';
import AboutSection from '../components/sections/About';

export const About: React.FC = () => {
  return (
    <div className="pt-20">
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Hakkımızda</h1>
          <p className="text-gray-300">Güzellik ve bakım konusundaki tutkumuz ve deneyimimiz</p>
        </div>
      </div>
      <AboutSection />
    </div>
  );
};
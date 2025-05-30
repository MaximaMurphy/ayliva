import React from 'react';
import ServicesSection from '../components/sections/Services';

export const Services: React.FC = () => {
  return (
    <div className="pt-20">
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Çalışmalarımız</h1>
          <p className="text-gray-300">Premium güzellik bakımlarımızı keşfedin</p>
        </div>
      </div>
      <ServicesSection />
    </div>
  );
};
import React from 'react';
import ContactSection from '../components/sections/Contact';

export const Appointment: React.FC = () => {
  return (
    <div className="pt-20">
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Randevu Al</h1>
          <p className="text-gray-300">Size en uygun zamanda hizmet vermekten mutluluk duyarız</p>
        </div>
      </div>
      <ContactSection />
    </div>
  );
};
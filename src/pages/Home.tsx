import React from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';
import FAQ from '../components/sections/FAQ';

export const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <About />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
  );
};
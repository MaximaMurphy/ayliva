import React, { useState, useEffect } from 'react';
import { smoothScroll } from '../../utils/animations';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: "https://images.pexels.com/photos/3993458/pexels-photo-3993458.jpeg",
      title: "Lüks Güzellik Deneyimi",
      subtitle: "Güzellik, mükemmellik ve stil burada buluşuyor",
    },
    {
      image: "https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg",
      title: "Uzman Stilistler",
      subtitle: "Profesyonel ekibimiz güzelliğiniz için çalışıyor",
    },
    {
      image: "https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg",
      title: "Premium Bakımlar",
      subtitle: "Özel güzellik hizmetlerimizi keşfedin",
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section 
      id="home" 
      className="relative h-screen w-full overflow-hidden"
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white px-4 max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4 opacity-0 animate-fade-up">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-0 animate-fade-up animation-delay-300">
                {slide.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 opacity-0 animate-fade-up animation-delay-600">
                <button 
                  onClick={() => smoothScroll('contact')}
                  className="bg-red-600 text-white py-3 px-8 rounded-sm hover:bg-red-700 transition-all duration-300 transform hover:translate-y-[-2px]"
                >
                  Randevu Al
                </button>
                <button 
                  onClick={() => smoothScroll('services')}
                  className="border border-white text-white py-3 px-8 rounded-sm hover:bg-white hover:text-black transition-all duration-300 transform hover:translate-y-[-2px]"
                >
                  Hizmetlerimiz
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-red-600' : 'bg-white/50'
            } transition-all duration-300`}
            aria-label={`Slayt ${index + 1}'e git`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
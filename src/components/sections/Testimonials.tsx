import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { observeElementInView } from '../../utils/animations';

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    if (sectionRef.current) {
      observeElementInView(sectionRef.current);
    }
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Ayşe M.",
      role: "Düzenli Müşteri",
      quote: "Ayliva Güzellik Salonu saç bakım rutinime yeni bir boyut kattı. Ekip inanılmaz yetenekli ve her zaman kendimi özel hissettiriyor. Saçlarımı başka kimseye emanet edemem!",
      rating: 5,
    },
    {
      id: 2,
      name: "Mehmet D.",
      role: "Sadık Müşteri",
      quote: "3 yılı aşkın süredir Ayliva'a geliyorum ve hizmet kalitesi her zaman üst düzeyde. Personel arkadaş canlısı, profesyonel ve yaptıkları işte gerçekten yetenekli.",
      rating: 5,
    },
    {
      id: 3,
      name: "Zeynep K.",
      role: "İlk Kez Gelen",
      quote: "Saçım konusunda çok titiz biri olarak yeni bir salonu denemek konusunda endişeliydim. Ayliva tüm beklentilerimi aştı! Stilistim istediğimi dinledi ve mükemmel sonuç verdi.",
      rating: 5,
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="py-20 bg-gray-50"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-black mb-4 opacity-0 animate-on-scroll">
            Müşteri <span className="text-red-600">Yorumları</span>
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-6 opacity-0 animate-on-scroll animation-delay-300"></div>
          <p className="text-gray-600 opacity-0 animate-on-scroll animation-delay-600">
            Değerli müşterilerimizin bizim hakkımızda söyledikleri
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto opacity-0 animate-on-scroll">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-sm shadow-lg p-8 md:p-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} size={18} className="text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        <blockquote className="text-gray-700 italic mb-6 text-lg">
                          "{testimonial.quote}"
                        </blockquote>
                        <div>
                          <h4 className="text-xl font-serif text-black">{testimonial.name}</h4>
                          <p className="text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={prevTestimonial}
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-black hover:bg-red-600 hover:text-white transition-colors duration-300"
            aria-label="Önceki yorum"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextTestimonial}
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-black hover:bg-red-600 hover:text-white transition-colors duration-300"
            aria-label="Sonraki yorum"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className="flex justify-center mt-8 space-x-2 opacity-0 animate-on-scroll animation-delay-300">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-red-600 w-6' : 'bg-gray-300'
              }`}
              aria-label={`${index + 1}. yoruma git`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
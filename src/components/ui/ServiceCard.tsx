import React, { useRef, useEffect } from 'react';
import { observeElementInView } from '../../utils/animations';

interface ServiceProps {
  service: {
    id: number;
    title: string;
    description: string;
    image: string;
    price: string;
  };
  delay: number;
}

const ServiceCard: React.FC<ServiceProps> = ({ service, delay }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cardRef.current) {
      observeElementInView(cardRef.current);
    }
  }, []);

  return (
    <div 
      ref={cardRef}
      className="group bg-white rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 opacity-0 animate-on-scroll"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden h-64">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block bg-red-600 text-white px-3 py-1 text-sm font-medium">
            {service.price}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-serif text-black mb-3">{service.title}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <button 
          className="text-black font-medium hover:text-red-600 transition-colors duration-300 flex items-center"
          onClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Book Now <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
import React, { useEffect, useState } from 'react';
import ServiceCard from '../ui/ServiceCard';
import { supabase } from '../../lib/supabase';

const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true);

      if (error) {
        console.error('Supabase Hatası:', error.message);
      } else {
        setServices(data || []);
      }

      setLoading(false);
    };

    fetchServices();
  }, []);

  if (loading) return <p className="text-center py-10">Yükleniyor...</p>;

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
            <span className="text-red-600">Çalışmalarımız</span>
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-gray-600">Premium güzellik hizmetlerimizi keşfedin</p>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-gray-500">Hiç hizmet bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={{
                  id: service.id,
                  title: service.title,
                  description: service.description,
                  image: service.image_url,
                  price: service.price,
                }}
                delay={index * 100}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;

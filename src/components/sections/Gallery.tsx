import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { observeElementInView } from '../../utils/animations';
import { supabase } from '../../lib/supabase';

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  description: string;
  category: string;
}

const Gallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (sectionRef.current) {
      observeElementInView(sectionRef.current);
    }
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(8); // Limit to 8 items for homepage

      if (error) {
        console.error('Error fetching gallery items:', error);
        return;
      }
      
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="gallery" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center text-gray-600">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="gallery" 
      ref={sectionRef}
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-black mb-4 opacity-0 animate-on-scroll">
            <span className="text-red-600">Galeri</span>
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-6 opacity-0 animate-on-scroll animation-delay-300"></div>
          <p className="text-gray-600 opacity-0 animate-on-scroll animation-delay-600">
            Etkileyici dönüşümlerimizi inceleyin
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item, index) => (
            <div 
              key={item.id} 
              className="overflow-hidden group cursor-pointer opacity-0 animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedImage(item.image_url)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-red-600 transition-colors duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            alt="Büyütülmüş galeri görüntüsü" 
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default Gallery;
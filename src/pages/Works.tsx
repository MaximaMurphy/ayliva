import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Work {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  active: boolean;
}

export const Works: React.FC = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWorks(data || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data?.map(work => work.category) || [])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorks = selectedCategory === 'all' 
    ? works 
    : works.filter(work => work.category === selectedCategory);

  if (loading) {
    return (
      <div className="pt-20">
        <div className="bg-black text-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Çalışmalarımız</h1>
            <p className="text-gray-300">Projelerimizi inceleyin</p>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Çalışmalarımız</h1>
          <p className="text-gray-300">Projelerimizi inceleyin</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-sm transition-colors duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-100'
              }`}
            >
              Tümü
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-sm transition-colors duration-300 ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorks.map((work) => (
            <div 
              key={work.id}
              className="group bg-white rounded-sm shadow-lg overflow-hidden"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={work.image_url}
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-serif mb-2">{work.title}</h3>
                    <p className="text-sm">{work.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif text-gray-900 mb-2">{work.title}</h3>
                <p className="text-gray-600 mb-4">{work.description}</p>
                <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-sm text-sm">
                  {work.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredWorks.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            Bu kategoride henüz çalışma bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
};
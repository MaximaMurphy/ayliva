import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  category: string;
  created_at: string;
}

export const Blog: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="pt-20 bg-white">
        <div className="bg-black text-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Blog</h1>
            <p className="text-gray-300">En son güzellik trendleri ve önerilerinden haberdar olun</p>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-white">
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Blog</h1>
          <p className="text-gray-300">En son güzellik trendleri ve önerilerinden haberdar olun</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-sm shadow-lg overflow-hidden group">
              <Link to={`/blog/${post.id}`}>
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white px-3 py-1 text-sm font-medium rounded-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
              </Link>
              
              <div className="p-6">
                <Link to={`/blog/${post.id}`}>
                  <h2 className="text-xl font-serif text-black mb-3 group-hover:text-red-600 transition-colors duration-300">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {formatDate(post.created_at)}
                  </div>
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    {Math.ceil(post.content.length / 1000)} dk okuma
                  </div>
                </div>
                
                <Link 
                  to={`/blog/${post.id}`}
                  className="mt-4 text-black font-medium hover:text-red-600 transition-colors duration-300 flex items-center"
                >
                  Devamını Oku <span className="ml-2">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
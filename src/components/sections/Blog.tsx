import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { observeElementInView } from '../../utils/animations';
import { supabase } from '../../lib/supabase';

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

const Blog: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (sectionRef.current) {
      observeElementInView(sectionRef.current);
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
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
      <section id="blog" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="blog" 
      ref={sectionRef}
      className="py-20 bg-gray-50"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-black mb-4 opacity-0 animate-on-scroll">
            <span className="text-red-600">Blog</span>
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-6 opacity-0 animate-on-scroll animation-delay-300"></div>
          <p className="text-gray-600 opacity-0 animate-on-scroll animation-delay-600">
            En son güzellik trendleri ve önerilerinden haberdar olun
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article 
              key={post.id} 
              className="bg-white rounded-sm shadow-lg overflow-hidden group opacity-0 animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` }}
            >
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
                  <h3 className="text-xl font-serif text-black mb-3 group-hover:text-red-600 transition-colors duration-300">
                    {post.title}
                  </h3>
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
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12 opacity-0 animate-on-scroll">
          <Link 
            to="/blog"
            className="bg-black text-white px-8 py-3 rounded-sm hover:bg-red-600 transition-colors duration-300 inline-flex items-center"
          >
            Tüm Yazıları Gör
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog;
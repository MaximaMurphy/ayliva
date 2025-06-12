import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  category: string;
  created_at: string;
}

export const BlogPost: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
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
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-serif mb-4">Blog yazısı bulunamadı</h2>
            <Link to="/blog" className="text-red-600 hover:text-red-700 flex items-center justify-center">
              <ArrowLeft size={20} className="mr-2" />
              Blog'a Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-white">
      <div className="relative h-[400px]">
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-6 text-white">
            <span className="bg-red-600 text-white px-3 py-1 text-sm font-medium rounded-sm mb-4 inline-block">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif mb-4">{post.title}</h1>
            <div className="flex items-center text-sm space-x-4">
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
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="mt-12 pt-8 border-t">
            <Link to="/blog" className="text-red-600 hover:text-red-700 flex items-center">
              <ArrowLeft size={20} className="mr-2" />
              Tüm Blog Yazıları
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
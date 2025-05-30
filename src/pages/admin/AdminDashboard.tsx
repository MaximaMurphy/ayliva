import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Calendar, ImagePlus, FileEdit, Code, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface DashboardStats {
  appointments: number;
  gallery: number;
  blogPosts: number;
}

interface Appointment {
  id: string;
  name: string;
  service: string;
  appointment_date: string;
  status: string;
}

interface BlogPost {
  id: string;
  title: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    appointments: 0,
    gallery: 0,
    blogPosts: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch counts
      const [appointmentsData, galleryData, blogData] = await Promise.all([
        supabase.from('appointments').select('count').single(),
        supabase.from('gallery').select('count').single(),
        supabase.from('blog_posts').select('count').single()
      ]);

      setStats({
        appointments: appointmentsData.data?.count || 0,
        gallery: galleryData.data?.count || 0,
        blogPosts: blogData.data?.count || 0
      });

      // Fetch recent appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select('id, name, service, appointment_date, status')
        .order('appointment_date', { ascending: true })
        .limit(3);

      setRecentAppointments(appointments || []);

      // Fetch recent blog posts
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      setRecentPosts(posts || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Onaylandı';
      case 'rejected':
        return 'Reddedildi';
      default:
        return 'Beklemede';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Toplam Randevu', 
      value: stats.appointments, 
      icon: Calendar, 
      color: 'bg-blue-500',
      link: '/admin/appointments'
    },
    { 
      label: 'Galeri Öğeleri', 
      value: stats.gallery, 
      icon: ImagePlus, 
      color: 'bg-purple-500',
      link: '/admin/gallery'
    },
    { 
      label: 'Blog Yazıları', 
      value: stats.blogPosts, 
      icon: FileEdit, 
      color: 'bg-orange-500',
      link: '/admin/blog'
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="relative">
            <Code size={28} className="text-purple-600" />
            <Zap size={14} className="absolute -top-1 -right-1 text-purple-600" />
          </div>
          <span>Webuxe</span>
          <span className="text-gray-400 ml-2">Yönetim Paneli</span>
        </h1>
        <p className="text-gray-600 mt-2">Hoş geldiniz! İşte güncel istatistikler ve son aktiviteler.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Link 
            key={index} 
            to={stat.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <div className={`inline-flex p-3 rounded-lg ${stat.color} bg-opacity-10 mb-4`}>
              <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Son Randevular</h2>
            <Link 
              to="/admin/appointments"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Tümünü Gör
            </Link>
          </div>
          <div className="space-y-4">
            {recentAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Henüz randevu bulunmuyor</p>
            ) : (
              recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.name}</p>
                    <p className="text-sm text-gray-600">{appointment.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{formatDate(appointment.appointment_date)}</p>
                    <span className={`text-sm ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Son Blog Yazıları</h2>
            <Link 
              to="/admin/blog"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Tümünü Gör
            </Link>
          </div>
          <div className="space-y-4">
            {recentPosts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Henüz blog yazısı bulunmuyor</p>
            ) : (
              recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{post.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(post.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <Link 
                    to={`/admin/blog`}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Düzenle
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Image, FileText, LogOut, Scissors, Code, Zap, Briefcase, Phone, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Panel', path: '/admin' },
    { icon: Calendar, label: 'Randevular', path: '/admin/appointments' },
    { icon: Scissors, label: 'Hizmetler', path: '/admin/services' },
    { icon: Briefcase, label: 'Çalışmalarımız', path: '/admin/works' },
    { icon: FileText, label: 'Blog', path: '/admin/blog' },
    { icon: Image, label: 'Galeri', path: '/admin/gallery' },
    { icon: Phone, label: 'İletişim', path: '/admin/contact' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Header */}
      <div className="lg:hidden bg-black text-white p-4 fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
        <button
          onClick={toggleMobileMenu}
          className="text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <Link to="/admin" className="flex items-center space-x-2">
          <div className="relative">
            <Code size={28} className="text-purple-600" />
            <Zap size={14} className="absolute -top-1 -right-1 text-purple-600" />
          </div>
          <span className="text-xl font-display font-bold">Webuxe</span>
        </Link>

        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
        w-64 
        bg-black 
        text-white 
        fixed 
        lg:relative
        top-0 
        left-0 
        h-screen
        z-40 
        transition-transform 
        duration-300 
        ease-in-out
        ${isMobileMenuOpen ? 'pt-20' : 'pt-0'}
        lg:pt-0
        flex
        flex-col
      `}>
        {/* Desktop Logo */}
        <div className="hidden lg:block p-4">
          <Link to="/admin" className="flex items-center space-x-2">
            <div className="relative">
              <Code size={28} className="text-purple-600" />
              <Zap size={14} className="absolute -top-1 -right-1 text-purple-600" />
            </div>
            <span className="text-xl font-display font-bold">Webuxe</span>
          </Link>
          <p className="text-sm text-gray-400">Yönetim Paneli</p>
        </div>
        
        <nav className="flex-1 mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={`flex items-center px-4 py-3 text-gray-300 hover:bg-black hover:text-purple-600 transition-colors duration-200 ${
                location.pathname === item.path ? 'bg-black text-purple-600' : ''
              }`}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-black hover:text-purple-600 transition-colors duration-200 mb-16"
        >
          <LogOut size={20} className="mr-3" />
          Çıkış Yap
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:p-8 p-4 mt-16 lg:mt-0">
        {children}
      </main>

      {/* Announcement Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-purple-600 text-white py-2 px-4 text-center z-50">
        <a 
          href="https://webuxe.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline inline-flex items-center justify-center"
        >
          Teknolojinin son noktası Webuxe.com iletişime geçmek için tıklayın
          <span className="ml-2">→</span>
        </a>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium text-black-900 mb-4">
              Oturumu Kapat
            </h3>
            <p className="text-gray-500 mb-6">
              Oturumu kapatmak istediğinizden emin misiniz?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                İptal
              </button>
              <button
                onClick={confirmLogout}
                className="bg-purple-600 text-white px-4 py-2 rounded-sm hover:bg-purple-700 transition-colors duration-300"
              >
                Oturumu Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
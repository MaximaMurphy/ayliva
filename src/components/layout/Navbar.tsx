import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scissors } from 'lucide-react';
import logo from '/img/logos.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Hakkımızda', href: '/about' },
    { name: 'Çalışmalarımız', href: '/services' },
    { name: 'Galeri', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'İletişim', href: '/contact' },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isHomePage
          ? scrolled
            ? 'bg-black/90 shadow-lg py-3'
            : 'bg-transparent py-5'
          : 'bg-black py-3'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white"
            onClick={closeMenu}
          >
            <img src={logo} className='h-10' />
            <span className="text-xl font-serif tracking-wider">AYLIVA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-white hover:text-red-600 font-medium transition-colors duration-300 ${
                  location.pathname === link.href ? 'text-red-600' : ''
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/appointment"
              className="bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-700 transition-colors duration-300"
              onClick={closeMenu}
            >
              Randevu Al
            </Link>
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Menü"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute left-0 right-0 bg-black/95 transition-all duration-300 ease-in-out ${
            isOpen
              ? 'opacity-100 visible top-full'
              : 'opacity-0 invisible -top-[400px]'
          }`}
        >
          <div className="flex flex-col px-4 pt-2 pb-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-white hover:text-red-600 py-2 border-b border-gray-800 font-medium transition-colors duration-300 ${
                  location.pathname === link.href ? 'text-red-600' : ''
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/appointment"
              className="mt-4 bg-red-600 text-white py-2 px-4 text-center rounded-sm hover:bg-red-700 transition-colors duration-300"
              onClick={closeMenu}
            >
              Randevu Al
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
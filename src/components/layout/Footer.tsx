import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-serif mb-6 text-red-600">AYLIVA</h3>
            <p className="text-gray-300 mb-6">
              2025'dan beri lüks ve kişisel bakım odaklı istisnai güzellik hizmetleri sunuyoruz.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-white hover:text-red-600 transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-red-600 transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-white hover:text-red-600 transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-serif mb-6">Hızlı Bağlantılar</h3>
            <ul className="space-y-3">
              {[
                ['Ana Sayfa', '/'],
                ['Hakkımızda', '/about'],
                ['Çalışmalarımız', '/services'],
                ['Galeri', '/gallery'],
                ['Blog', '/blog'],
                ['İletişim', '/contact']
              ].map(([name, path]) => (
                <li key={name}>
                  <a 
                    href={path}
                    className="text-gray-300 hover:text-red-600 transition-colors duration-300"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-serif mb-6">Hizmetlerimiz</h3>
            <ul className="space-y-3">
              {[
                'Ağda', 
                'Bölgesel İncelme', 
                'Cilt Bakımı', 
                'Manikür & Pedikür',
                'Makyaj & Stil',
                'Saç Kaynak',
                'Epilasyon'
              ].map((service) => (
                <li key={service}>
                  <a 
                    href="/services" 
                    className="text-gray-300 hover:text-red-600 transition-colors duration-300"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-serif mb-6">İletişim Bilgileri</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 text-red-600 flex-shrink-0 mt-1" size={18} />
                <span className="text-gray-300">Hocacihan Mah Mahmudiye sokak no:11/DE Selçuklu Konya</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-red-600" size={18} />
                <a href="tel:+905427950657" className="text-gray-300 hover:text-red-600 transition-colors duration-300">
                  0542 795 0657
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-red-600" size={18} />
                <a href="mailto:aylivaguzellik@gmail.com" className="text-gray-300 hover:text-red-600 transition-colors duration-300">
                  aylivaguzellik@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <Clock className="mr-3 text-red-600 flex-shrink-0 mt-1" size={18} />
                <div className="text-gray-300">
                  <p>Pazartesi - Cuma: 09:00 - 20:00</p>
                  <p>Cumartesi: 09:00 - 18:00</p>
                  <p>Pazar: 10:00 - 16:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Ayliva Güzellik Salonu. Tüm hakları <a href="https://eastmedikal.com" target="_blank" className='text-red-500'>East Medikal</a> aittir.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
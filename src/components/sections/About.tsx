import React, { useEffect, useRef } from 'react';
import { observeElementInView } from '../../utils/animations';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (sectionRef.current) {
      observeElementInView(sectionRef.current);
    }
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-black mb-4 opacity-0 animate-on-scroll">
            <span className="text-red-600">Ayliva</span> Hakkında
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-6 opacity-0 animate-on-scroll animation-delay-300"></div>
          <p className="text-gray-600 opacity-0 animate-on-scroll animation-delay-600">
            Güzelliğinizi ortaya çıkaran profesyonel dokunuş
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative opacity-0 animate-on-scroll">
            <img 
              src="https://images.pexels.com/photos/3997986/pexels-photo-3997986.jpeg" 
              alt="Ayliva Güzellik Salonu Hakkında" 
              className="w-full h-auto rounded-sm"
            />
            <div className="absolute -bottom-6 -right-6 bg-red-600 text-white py-4 px-6 rounded-sm hidden md:block">
              <p className="text-lg font-serif">2025'den beri</p>
            </div>
          </div>
          
          <div className="opacity-0 animate-on-scroll animation-delay-300">
            <h3 className="text-2xl font-serif text-black mb-6">Güzelliğiniz Bizim Sanatımız</h3>
            
            <p className="text-gray-700 mb-6">
              2025 yılında kurulan Ayliva Güzellik Salonu, modern güzellik anlayışını geleneksel değerlerle birleştirerek, müşterilerimize en kaliteli ve kişiselleştirilmiş hizmetleri sunmayı amaçlamaktadır. Her müşterimizin kendini özel hissetmesi için özenle tasarlanmış atmosferimiz ve uzman ekibimizle hizmetinizdeyiz.
            </p>
            
            <p className="text-gray-700 mb-6">
              Ayliva olarak, sürekli gelişen güzellik sektöründeki en son trendleri ve teknikleri takip ediyor, bunları sizlere en profesyonel şekilde sunuyoruz. Deneyimli ekibimiz, sürekli eğitimlerle kendini geliştirerek, size en iyi hizmeti sunmak için çalışıyor.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-lg font-medium text-red-600 mb-2">Misyonumuz</h4>
                <p className="text-gray-700">Müşterilerimizin doğal güzelliklerini ortaya çıkararak, kendilerine olan güvenlerini artırmak ve kalıcı memnuniyet sağlamak.</p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-red-600 mb-2">Vizyonumuz</h4>
                <p className="text-gray-700">Güzellik sektöründe yenilikçi yaklaşımlarla öncü olmak ve müşteri memnuniyetinde lider konumda kalmak.</p>
              </div>
            </div>
            
            <button 
              className="bg-black text-white py-3 px-8 rounded-sm hover:bg-red-600 transition-colors duration-300"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Bize Ulaşın
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
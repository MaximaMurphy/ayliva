import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "Randevu iptali için ne kadar önce haber vermeliyim?",
      answer: "Randevunuzu en az 24 saat öncesinden iptal etmenizi rica ediyoruz. Bu süre içinde yapılan iptallerde herhangi bir ücret talep edilmemektedir. Böylece diğer müşterilerimize hizmet verebilme fırsatı yakalıyoruz."
    },
    {
      question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
      answer: "Nakit, kredi kartı ve banka kartı ile ödeme kabul ediyoruz. Ayrıca mobil ödeme sistemleri üzerinden de ödeme yapabilirsiniz. Tüm major kredi kartlarına taksit imkanımız bulunmaktadır."
    },
    {
      question: "İlk defa gelecek müşteriler için konsültasyon ücretsiz mi?",
      answer: "Evet, ilk ziyaretinizde ücretsiz konsültasyon hizmeti sunuyoruz. Uzman ekibimiz sizin için en uygun bakım ve tedavi planını belirleyecektir. Bu görüşmede tüm sorularınızı yanıtlıyor ve size özel önerilerde bulunuyoruz."
    },
    {
      question: "Kullandığınız ürünler hakkında bilgi alabilir miyim?",
      answer: "Salonumuzda dünyaca ünlü markaların profesyonel ürünlerini kullanıyoruz. Tüm ürünlerimiz orijinal ve sertifikalıdır. Müşterilerimizin cilt ve saç yapısına uygun ürünler seçiyor ve ev bakımı için önerilerde bulunuyoruz."
    },
    {
      question: "Grup rezervasyonu yapabilir miyim?",
      answer: "Evet, özel günler, düğün hazırlıkları veya arkadaş grupları için özel rezervasyon yapabilirsiniz. Grup rezervasyonlarında özel indirimler sunuyor ve size özel hizmet programı hazırlıyoruz. Detaylı bilgi için bize ulaşabilirsiniz."
    }
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
            Sıkça Sorulan <span className="text-red-600">Sorular</span>
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-gray-600">
            Merak ettiğiniz soruların cevaplarını bulun
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="mb-4 bg-white rounded-sm shadow-sm"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                onClick={() => toggleQuestion(index)}
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-red-600 flex-shrink-0" size={20} />
                ) : (
                  <ChevronDown className="text-red-600 flex-shrink-0" size={20} />
                )}
              </button>
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 pb-4' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
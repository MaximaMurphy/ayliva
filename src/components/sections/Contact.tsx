import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { supabase, handleSupabaseError } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  price: string;
}

interface ContactInfo {
  id: string;
  address: string;
  phone: string;
  email: string;
  working_hours: {
    monday_friday: string;
    saturday: string;
    sunday: string;
  };
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  appointment_date: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
  appointment_date: '',
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [services, setServices] = useState<Service[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [servicesResponse, contactResponse] = await Promise.all([
        supabase
          .from('services')
          .select('id, name, price')
          .eq('active', true)
          .order('name'),
        supabase
          .from('contact_info')
          .select('*')
          .single()
      ]);

      if (servicesResponse.error) throw servicesResponse.error;
      if (contactResponse.error) throw contactResponse.error;

      setServices(servicesResponse.data || []);
      setContactInfo(contactResponse.data);
    } catch (error) {
      toast.error(handleSupabaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.service || !formData.appointment_date) {
      toast.error('Lütfen gerekli alanları doldurun.');
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('appointments')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          appointment_date: new Date(formData.appointment_date).toISOString(),
          status: 'pending'
        }]);

      if (error) throw error;

      toast.success('Randevu talebiniz alındı. En kısa sürede size geri dönüş yapacağız.');
      setFormData(initialFormData);
    } catch (error) {
      toast.error(handleSupabaseError(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!contactInfo) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">İletişim bilgileri yüklenirken bir hata oluştu.</p>
            <button 
              onClick={fetchData}
              className="bg-red-600 text-white px-6 py-2 rounded-sm hover:bg-red-700 transition-colors duration-300"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
            <span className="text-red-600">Randevu</span> Alın
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-gray-600">
            Premium hizmetlerimiz için randevu alın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-gray-50 p-8 rounded-sm h-full">
              <h3 className="text-2xl font-serif text-black mb-8">İletişim Bilgileri</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="text-red-600 mr-4 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-black mb-1">Adres</h4>
                    <p className="text-gray-700">{contactInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-red-600 mr-4 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-black mb-1">Telefon</h4>
                    <p className="text-gray-700">{contactInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-red-600 mr-4 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-black mb-1">E-posta</h4>
                    <p className="text-gray-700">{contactInfo.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-red-600 mr-4 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-black mb-1">Çalışma Saatleri</h4>
                    <p className="text-gray-700">Pazartesi - Cuma: {contactInfo.working_hours.monday_friday}</p>
                    <p className="text-gray-700">Cumartesi: {contactInfo.working_hours.saturday}</p>
                    <p className="text-gray-700">Pazar: {contactInfo.working_hours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    Hizmet <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  >
                    <option value="">Hizmet seçin</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name} {service.price ? `- ${service.price}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Randevu Tarihi <span className="text-red-600">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="appointment_date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mesaj
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-red-600 text-white py-3 px-8 rounded-sm hover:bg-black transition-colors duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Gönderiliyor...' : 'Randevu Al'} 
                  {!submitting && <Send size={18} className="ml-2" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
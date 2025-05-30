import React, { useState, useEffect } from 'react';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  active: boolean;
}

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        // Update existing service
        const updatedService = {
          name: formData.name,
          description: formData.description || null,
          price: formData.price || null,
          duration: formData.duration || null,
          category: formData.category,
          active: editingService.active
        };

        const { data, error } = await supabase
          .from('services')
          .update(updatedService)
          .eq('id', editingService.id)
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setServices(prevServices => 
          prevServices.map(service => 
            service.id === editingService.id ? { ...service, ...data } : service
          )
        );

        alert('Hizmet başarıyla güncellendi.');
      } else {
        // Create new service
        const newService = {
          ...formData,
          active: true,
          description: formData.description || null,
          price: formData.price || null,
          duration: formData.duration || null
        };

        const { data, error } = await supabase
          .from('services')
          .insert([newService])
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setServices(prevServices => [...prevServices, data]);
        alert('Yeni hizmet başarıyla eklendi.');
      }

      // Reset form and close modal
      setShowModal(false);
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: '',
      });
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Hizmet kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price || '',
      duration: service.duration || '',
      category: service.category || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting service:', error);
        alert('Hizmet silinirken bir hata oluştu. Lütfen tekrar deneyin.');
        return;
      }

      // Only update local state if deletion was successful
      setServices(prevServices => prevServices.filter(service => service.id !== id));
      alert('Hizmet başarıyla silindi.');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Hizmet silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update({ active: !service.active })
        .eq('id', service.id)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setServices(prevServices => 
        prevServices.map(s => 
          s.id === service.id ? { ...s, active: !s.active } : s
        )
      );

      alert(`Hizmet ${data.active ? 'aktif' : 'pasif'} duruma getirildi.`);
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Hizmet durumu güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif">Hizmet Yönetimi</h1>
        <button
          onClick={() => {
            setEditingService(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              duration: '',
              category: '',
            });
            setShowModal(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-sm flex items-center hover:bg-purple-700 transition-colors duration-300"
        >
          <Plus size={20} className="mr-2" />
          Yeni Hizmet Ekle
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hizmet Adı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Süre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-500">{service.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(service)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          service.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.active ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-serif">
                {editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hizmet Adı <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-sm"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fiyat
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-sm"
                  placeholder="45 ₺'den başlayan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Süre
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-sm"
                  placeholder="30-60 dk"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-sm"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-sm hover:bg-purple-700 transition-colors duration-300"
                >
                  {editingService ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
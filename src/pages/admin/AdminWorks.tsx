import React, { useState, useEffect } from 'react';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Work {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  active: boolean;
  created_at: string;
}

export const AdminWorks: React.FC = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
  });

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorks(data || []);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWork) {
        const { error } = await supabase
          .from('works')
          .update({
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            category: formData.category,
          })
          .eq('id', editingWork.id);

        if (error) throw error;
        alert('Çalışma başarıyla güncellendi.');
      } else {
        const { error } = await supabase
          .from('works')
          .insert([{
            ...formData,
            active: true
          }]);

        if (error) throw error;
        alert('Yeni çalışma başarıyla eklendi.');
      }

      setShowModal(false);
      setEditingWork(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        category: '',
      });
      await fetchWorks();
    } catch (error) {
      console.error('Error saving work:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleEdit = (work: Work) => {
    setEditingWork(work);
    setFormData({
      title: work.title,
      description: work.description || '',
      image_url: work.image_url || '',
      category: work.category || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu çalışmayı silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('works')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWorks(prevWorks => prevWorks.filter(work => work.id !== id));
      alert('Çalışma başarıyla silindi.');
    } catch (error) {
      console.error('Error deleting work:', error);
      alert('Çalışma silinirken bir hata oluştu.');
    }
  };

  const toggleActive = async (work: Work) => {
    try {
      const { error } = await supabase
        .from('works')
        .update({ active: !work.active })
        .eq('id', work.id);

      if (error) throw error;
      setWorks(prevWorks =>
        prevWorks.map(w =>
          w.id === work.id ? { ...w, active: !w.active } : w
        )
      );
    } catch (error) {
      console.error('Error updating work status:', error);
      alert('Durum güncellenirken bir hata oluştu.');
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
        <h1 className="text-2xl font-serif">Çalışmalarımız</h1>
        <button
          onClick={() => {
            setEditingWork(null);
            setFormData({
              title: '',
              description: '',
              image_url: '',
              category: '',
            });
            setShowModal(true);
          }}
          className="inline-flex items-center bg-purple-600 text-white px-4 py-2 rounded-sm hover:bg-purple-700 transition-colors duration-300 text-sm"
        >
          <Plus size={16} className="mr-2" />
          Yeni Çalışma
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work) => (
          <div key={work.id} className="bg-white rounded-sm shadow-md overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={work.image_url}
                alt={work.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(work)}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(work.id)}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors duration-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">{work.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{work.description}</p>
              <div className="flex items-center justify-between">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-sm text-sm">
                  {work.category}
                </span>
                <button
                  onClick={() => toggleActive(work)}
                  className={`flex items-center px-2 py-1 rounded-sm text-sm ${
                    work.active
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${work.active ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                  {work.active ? 'Aktif' : 'Pasif'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Work Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-serif">
                {editingWork ? 'Çalışmayı Düzenle' : 'Yeni Çalışma Ekle'}
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
                  Başlık <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  Görsel URL <span className="text-red-600">*</span>
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-sm"
                  required
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
                  {editingWork ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Trash2, Upload, Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  description: string;
  category: string;
  published: boolean;
}

export const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newImage, setNewImage] = useState({
    title: '',
    image_url: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession.session?.user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setError('Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchGalleryItems();
      setError(null);
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession.session?.user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('gallery')
        .insert([{
          ...newImage,
          published: true
        }]);

      if (error) throw error;

      setShowAddModal(false);
      setNewImage({
        title: '',
        image_url: '',
        description: '',
        category: '',
      });
      setError(null);
      await fetchGalleryItems();
    } catch (error) {
      console.error('Error adding image:', error);
      setError('Failed to add image. Please make sure you have admin privileges.');
    }
  };

  const togglePublish = async (item: GalleryItem) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ published: !item.published })
        .eq('id', item.id);

      if (error) throw error;
      await fetchGalleryItems();
      setError(null);
    } catch (error) {
      console.error('Error updating image:', error);
      setError('Failed to update image status');
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
        <h1 className="text-2xl font-serif">Galeri Yönetimi</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-sm flex items-center hover:bg-red-700 transition-colors duration-300"
        >
          <Plus size={20} className="mr-2" />
          Yeni Görsel Ekle
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-sm shadow-md overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleDelete(image.id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors duration-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">{image.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{image.description}</p>
              <div className="flex items-center justify-between">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-sm text-sm">
                  {image.category}
                </span>
                <button
                  onClick={() => togglePublish(image)}
                  className={`flex items-center px-2 py-1 rounded-sm text-sm ${
                    image.published
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${image.published ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                  {image.published ? 'Yayında' : 'Taslak'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Image Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-serif">Yeni Görsel Ekle</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Görsel URL
                  </label>
                  <input
                    type="url"
                    value={newImage.image_url}
                    onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={newImage.description}
                    onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-sm"
                    rows={3}
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={newImage.category}
                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-sm"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-700 transition-colors duration-300"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};